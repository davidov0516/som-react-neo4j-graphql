"use strict";
/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRelationPredicate = exports.createRelationshipOperation = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_where_predicate_1 = require("../create-where-predicate");
const utils_1 = require("../utils");
const create_connection_operation_1 = require("./create-connection-operation");
const get_relationship_direction_1 = require("../../../utils/get-relationship-direction");
function createRelationshipOperation({ relationField, context, parentNode, operator, value, isNot, useExistExpr = true, checkParameterExistence, }) {
    const refNode = context.nodes.find((n) => n.name === relationField.typeMeta.name);
    if (!refNode)
        throw new Error("Relationship filters must reference nodes");
    const childNode = new cypher_builder_1.default.Node({ labels: refNode.getLabels(context) });
    const relationship = new cypher_builder_1.default.Relationship({ type: relationField.type });
    const direction = (0, get_relationship_direction_1.getCypherRelationshipDirection)(relationField);
    const matchPattern = new cypher_builder_1.default.Pattern(parentNode)
        .withoutLabels()
        .related(relationship)
        .withoutVariable()
        .withDirection(direction)
        .to(childNode);
    // TODO: check null in return projection
    if (value === null) {
        const existsSubquery = new cypher_builder_1.default.Match(matchPattern);
        const exists = new cypher_builder_1.default.Exists(existsSubquery);
        if (!isNot) {
            // Bit confusing, but basically checking for not null is the same as checking for relationship exists
            return { predicate: cypher_builder_1.default.not(exists) };
        }
        return { predicate: exists };
    }
    return createRelationPredicate({
        targetNode: childNode,
        targetPattern: matchPattern,
        targetRelationship: relationship,
        parentNode,
        refNode,
        context,
        relationField,
        whereInput: value,
        whereOperator: operator,
        useExistExpr,
        checkParameterExistence,
    });
}
exports.createRelationshipOperation = createRelationshipOperation;
function createRelationPredicate({ targetNode, targetPattern, targetRelationship, parentNode, refNode, context, relationField, whereInput, whereOperator, refEdge, useExistExpr = true, checkParameterExistence, }) {
    let labelsOfNodesImplementingInterface;
    let labels = refNode.getLabels(context);
    const nodeOnObj = whereInput?.node?._on;
    const hasOnlyNodeObjectFilter = whereInput?.node && !nodeOnObj;
    if (hasOnlyNodeObjectFilter) {
        const nodesImplementingInterface = context.nodes.filter((x) => x.interfaces.some((i) => i.name.value === relationField.typeMeta.name));
        labelsOfNodesImplementingInterface = nodesImplementingInterface.map((n) => n.getLabels(context)).flat();
        if (labelsOfNodesImplementingInterface?.length) {
            // set labels to an empty array. We check for the possible interface implementations in the WHERE clause instead (that is Neo4j 4.x safe)
            labels = [];
        }
    }
    let orOperatorMultipleNodeLabels;
    if (labelsOfNodesImplementingInterface?.length) {
        orOperatorMultipleNodeLabels = cypher_builder_1.default.or(...labelsOfNodesImplementingInterface.map((label) => targetNode.hasLabel(label)));
    }
    targetNode.labels = labels;
    let listPredicateStr = (0, utils_1.getListPredicate)(whereOperator);
    if (listPredicateStr === "any" && !relationField.typeMeta.array) {
        listPredicateStr = "single";
    }
    const innerOperation = refEdge
        ? (0, create_connection_operation_1.createConnectionWherePropertyOperation)({
            context,
            whereInput,
            edge: refEdge,
            node: refNode,
            targetNode,
            edgeRef: targetRelationship,
            useExistExpr,
            checkParameterExistence,
        })
        : (0, create_where_predicate_1.createWherePredicate)({
            whereInput,
            targetElement: targetNode,
            element: refNode,
            context,
            useExistExpr,
            checkParameterExistence,
        });
    if (orOperatorMultipleNodeLabels) {
        innerOperation.predicate = cypher_builder_1.default.and(innerOperation.predicate, orOperatorMultipleNodeLabels);
    }
    if (innerOperation.predicate &&
        innerOperation.preComputedSubqueries &&
        !innerOperation.preComputedSubqueries.empty) {
        return createRelationPredicateWithSubqueries({
            parentNode,
            targetNode,
            targetPattern,
            targetRelationship,
            preComputedSubqueries: innerOperation.preComputedSubqueries,
            innerOperation: innerOperation.predicate,
            listPredicateStr,
            whereInput,
            context,
            refNode,
            refEdge,
            checkParameterExistence,
        });
    }
    return createSimpleRelationshipPredicate({
        childNode: targetNode,
        matchPattern: targetPattern,
        listPredicateStr,
        innerOperation: innerOperation.predicate,
        relationField,
        useExistExpr,
    });
}
exports.createRelationPredicate = createRelationPredicate;
function createSimpleRelationshipPredicate({ matchPattern, listPredicateStr, childNode, innerOperation, relationField, useExistExpr = true, }) {
    if (!innerOperation)
        return { predicate: undefined };
    const matchClause = new cypher_builder_1.default.Match(matchPattern).where(innerOperation);
    switch (listPredicateStr) {
        case "all": {
            if (!useExistExpr) {
                const patternComprehension = new cypher_builder_1.default.PatternComprehension(matchPattern, new cypher_builder_1.default.Literal(1));
                const sizeFunction = cypher_builder_1.default.size(patternComprehension.where(cypher_builder_1.default.not(innerOperation)));
                return { predicate: cypher_builder_1.default.eq(sizeFunction, new cypher_builder_1.default.Literal(0)) };
            }
            // Testing "ALL" requires testing that at least one element exists and that no elements not matching the filter exists
            const notExistsMatchClause = new cypher_builder_1.default.Match(matchPattern).where(cypher_builder_1.default.not(innerOperation));
            return {
                predicate: cypher_builder_1.default.and(new cypher_builder_1.default.Exists(matchClause), cypher_builder_1.default.not(new cypher_builder_1.default.Exists(notExistsMatchClause))),
            };
        }
        case "single": {
            const isArray = relationField.typeMeta.array;
            const isRequired = relationField.typeMeta.required;
            const isUnionField = Boolean(relationField.union);
            if (isArray || !isRequired || isUnionField) {
                const patternComprehension = new cypher_builder_1.default.PatternComprehension(matchPattern, new cypher_builder_1.default.Literal(1)).where(innerOperation);
                return { predicate: cypher_builder_1.default.single(childNode, patternComprehension, new cypher_builder_1.default.Literal(true)) };
            }
            const matchStatement = new cypher_builder_1.default.OptionalMatch(matchPattern);
            const countAlias = new cypher_builder_1.default.NamedVariable(`${relationField.fieldName}Count`);
            const withStatement = new cypher_builder_1.default.With([cypher_builder_1.default.count(childNode), countAlias], "*");
            const countNeqZero = cypher_builder_1.default.neq(countAlias, new cypher_builder_1.default.Literal(0));
            return {
                predicate: cypher_builder_1.default.and(countNeqZero, innerOperation),
                preComputedSubqueries: cypher_builder_1.default.concat(matchStatement, withStatement),
            };
        }
        case "not":
        case "none": {
            if (!useExistExpr) {
                const patternComprehension = new cypher_builder_1.default.PatternComprehension(matchPattern, new cypher_builder_1.default.Literal(1));
                const sizeFunction = cypher_builder_1.default.size(patternComprehension.where(innerOperation));
                return { predicate: cypher_builder_1.default.eq(sizeFunction, new cypher_builder_1.default.Literal(0)) };
            }
            const existsPredicate = new cypher_builder_1.default.Exists(matchClause);
            return { predicate: cypher_builder_1.default.not(existsPredicate) };
        }
        case "any":
        default: {
            if (!useExistExpr) {
                const patternComprehension = new cypher_builder_1.default.PatternComprehension(matchPattern, new cypher_builder_1.default.Literal(1));
                const sizeFunction = cypher_builder_1.default.size(patternComprehension.where(innerOperation));
                return { predicate: cypher_builder_1.default.gt(sizeFunction, new cypher_builder_1.default.Literal(0)) };
            }
            const existsPredicate = new cypher_builder_1.default.Exists(matchClause);
            return { predicate: existsPredicate };
        }
    }
}
function createRelationPredicateWithSubqueries({ targetNode, targetPattern, targetRelationship, preComputedSubqueries, innerOperation, listPredicateStr, parentNode, refNode, context, whereInput, refEdge, checkParameterExistence, }) {
    const matchPattern = new cypher_builder_1.default.Match(targetPattern);
    const subqueryWith = new cypher_builder_1.default.With("*");
    const returnVar = new cypher_builder_1.default.Variable();
    subqueryWith.where(innerOperation);
    const subqueryContents = cypher_builder_1.default.concat(new cypher_builder_1.default.With(parentNode), matchPattern, preComputedSubqueries, subqueryWith);
    switch (listPredicateStr) {
        case "all": {
            const subquery = new cypher_builder_1.default.Call(cypher_builder_1.default.concat(subqueryContents, new cypher_builder_1.default.Return([cypher_builder_1.default.gt(cypher_builder_1.default.count(targetNode), new cypher_builder_1.default.Literal(0)), returnVar])));
            const notNoneInnerPredicates = refEdge
                ? (0, create_connection_operation_1.createConnectionWherePropertyOperation)({
                    context,
                    whereInput,
                    edge: refEdge,
                    node: refNode,
                    targetNode,
                    edgeRef: targetRelationship,
                    checkParameterExistence,
                })
                : (0, create_where_predicate_1.createWherePredicate)({
                    whereInput,
                    targetElement: targetNode,
                    element: refNode,
                    context,
                    checkParameterExistence,
                });
            if (notNoneInnerPredicates.predicate && notNoneInnerPredicates.preComputedSubqueries) {
                const { predicate: notExistsPredicate, preComputedSubqueries: notExistsSubquery } = createRelationPredicateWithSubqueries({
                    targetNode,
                    parentNode,
                    targetPattern,
                    targetRelationship,
                    preComputedSubqueries: notNoneInnerPredicates.preComputedSubqueries,
                    innerOperation: cypher_builder_1.default.not(notNoneInnerPredicates.predicate),
                    listPredicateStr: "none",
                    whereInput,
                    refNode,
                    context,
                    refEdge,
                    checkParameterExistence,
                });
                return {
                    predicate: cypher_builder_1.default.and(notExistsPredicate, cypher_builder_1.default.eq(returnVar, new cypher_builder_1.default.Literal(true))),
                    preComputedSubqueries: cypher_builder_1.default.concat(subquery, notExistsSubquery),
                };
            }
            return { predicate: undefined };
        }
        case "single": {
            const subquery = new cypher_builder_1.default.Call(cypher_builder_1.default.concat(subqueryContents, new cypher_builder_1.default.Return([cypher_builder_1.default.eq(cypher_builder_1.default.count(targetNode), new cypher_builder_1.default.Literal(1)), returnVar])));
            return {
                predicate: cypher_builder_1.default.eq(returnVar, new cypher_builder_1.default.Literal(true)),
                preComputedSubqueries: cypher_builder_1.default.concat(subquery),
            };
        }
        case "not":
        case "none":
        case "any":
        default: {
            const subquery = new cypher_builder_1.default.Call(cypher_builder_1.default.concat(subqueryContents, new cypher_builder_1.default.Return([cypher_builder_1.default.gt(cypher_builder_1.default.count(targetNode), new cypher_builder_1.default.Literal(0)), returnVar])));
            if (["not", "none"].includes(listPredicateStr)) {
                return {
                    predicate: cypher_builder_1.default.eq(returnVar, new cypher_builder_1.default.Literal(false)),
                    preComputedSubqueries: cypher_builder_1.default.concat(subquery),
                };
            }
            return {
                predicate: cypher_builder_1.default.eq(returnVar, new cypher_builder_1.default.Literal(true)),
                preComputedSubqueries: cypher_builder_1.default.concat(subquery),
            };
        }
    }
}
//# sourceMappingURL=create-relationship-operation.js.map