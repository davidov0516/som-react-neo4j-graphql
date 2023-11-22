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
exports.hasExplicitNodeInInterfaceWhere = exports.createConnectionWherePropertyOperation = exports.createConnectionOperation = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
// Recursive function
const create_where_predicate_1 = require("../create-where-predicate");
const utils_1 = require("../../../utils/utils");
const logical_operators_1 = require("../../utils/logical-operators");
const create_relationship_operation_1 = require("./create-relationship-operation");
const get_relationship_direction_1 = require("../../../utils/get-relationship-direction");
function createConnectionOperation({ connectionField, value, context, parentNode, operator, useExistExpr = true, checkParameterExistence, }) {
    let nodeEntries;
    if (!connectionField?.relationship.union) {
        nodeEntries = { [connectionField.relationship.typeMeta.name]: value };
    }
    else {
        nodeEntries = value;
    }
    let subqueries;
    const operations = [];
    const matchPatterns = [];
    Object.entries(nodeEntries).forEach((entry) => {
        let nodeOnValue = undefined;
        const nodeOnObj = entry[1]?.node?._on;
        if (nodeOnObj) {
            nodeOnValue = Object.keys(nodeOnObj)[0];
        }
        let refNode = context.nodes.find((x) => x.name === nodeOnValue || x.name === entry[0]);
        if (!refNode) {
            refNode = context.nodes.find((x) => x.interfaces.some((i) => i.name.value === entry[0]));
        }
        const relationField = connectionField.relationship;
        const childNode = new cypher_builder_1.default.Node();
        const relationship = new cypher_builder_1.default.Relationship({ type: relationField.type });
        const direction = (0, get_relationship_direction_1.getCypherRelationshipDirection)(relationField);
        const matchPattern = new cypher_builder_1.default.Pattern(parentNode)
            .withoutLabels()
            .related(relationship)
            .withDirection(direction)
            .to(childNode);
        const contextRelationship = context.relationships.find((x) => x.name === connectionField.relationshipTypeName);
        matchPatterns.push(matchPattern);
        const { predicate, preComputedSubqueries } = (0, create_relationship_operation_1.createRelationPredicate)({
            targetNode: childNode,
            targetPattern: matchPattern,
            targetRelationship: relationship,
            parentNode,
            refNode,
            context,
            relationField,
            whereInput: entry[1],
            whereOperator: operator,
            refEdge: contextRelationship,
            useExistExpr,
            checkParameterExistence,
        });
        operations.push(predicate);
        subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
    });
    return {
        predicate: cypher_builder_1.default.and(...operations),
        preComputedSubqueries: subqueries,
    };
}
exports.createConnectionOperation = createConnectionOperation;
function createConnectionWherePropertyOperation({ context, whereInput, edgeRef, targetNode, node, edge, useExistExpr = true, checkParameterExistence, }) {
    const preComputedSubqueriesResult = [];
    const params = [];
    Object.entries(whereInput).forEach(([key, value]) => {
        if ((0, logical_operators_1.isLogicalOperator)(key)) {
            const subOperations = [];
            (0, utils_1.asArray)(value).forEach((input) => {
                const { predicate, preComputedSubqueries } = createConnectionWherePropertyOperation({
                    context,
                    whereInput: input,
                    edgeRef,
                    targetNode,
                    node,
                    edge,
                    useExistExpr,
                    checkParameterExistence,
                });
                subOperations.push(predicate);
                if (preComputedSubqueries && !preComputedSubqueries.empty)
                    preComputedSubqueriesResult.push(preComputedSubqueries);
            });
            const logicalPredicate = (0, logical_operators_1.getLogicalPredicate)(key, (0, utils_1.filterTruthy)(subOperations));
            params.push(logicalPredicate);
            return;
        }
        if (key.startsWith("edge")) {
            const nestedProperties = value;
            const { predicate: result, preComputedSubqueries } = (0, create_where_predicate_1.createWherePredicate)({
                targetElement: edgeRef,
                whereInput: nestedProperties,
                context,
                element: edge,
                useExistExpr,
                checkParameterExistence,
            });
            params.push(result);
            if (preComputedSubqueries && !preComputedSubqueries.empty)
                preComputedSubqueriesResult.push(preComputedSubqueries);
            return;
        }
        if (key.startsWith("node") || key.startsWith(node.name)) {
            // TODO: improve nodeOn properties generation
            const nodeOnProperties = value._on?.[node.name] || {};
            const nestedProperties = { ...value, ...nodeOnProperties };
            delete nestedProperties._on;
            if (Object.keys(value).length === 1 &&
                value._on &&
                !Object.prototype.hasOwnProperty.call(value._on, node.name)) {
                throw new Error("_on is used as the only argument and node is not present within");
            }
            const { predicate: result, preComputedSubqueries } = (0, create_where_predicate_1.createWherePredicate)({
                targetElement: targetNode,
                whereInput: nestedProperties,
                context,
                element: node,
                useExistExpr,
                checkParameterExistence,
            });
            // NOTE: _NOT is handled by the size()=0
            params.push(result);
            if (preComputedSubqueries && !preComputedSubqueries.empty)
                preComputedSubqueriesResult.push(preComputedSubqueries);
            return;
        }
    });
    return {
        predicate: cypher_builder_1.default.and(...(0, utils_1.filterTruthy)(params)),
        preComputedSubqueries: preComputedSubqueriesResult.length
            ? cypher_builder_1.default.concat(...preComputedSubqueriesResult)
            : undefined,
    };
}
exports.createConnectionWherePropertyOperation = createConnectionWherePropertyOperation;
/** Checks if a where property has an explicit interface inside _on */
function hasExplicitNodeInInterfaceWhere({ whereInput, node, }) {
    for (const [key, value] of Object.entries(whereInput)) {
        if (key.startsWith("node") || key.startsWith(node.name)) {
            if (Object.keys(value).length === 1 &&
                value._on &&
                !Object.prototype.hasOwnProperty.call(value._on, node.name)) {
                return false;
            }
            return true;
        }
    }
    return true;
}
exports.hasExplicitNodeInInterfaceWhere = hasExplicitNodeInInterfaceWhere;
//# sourceMappingURL=create-connection-operation.js.map