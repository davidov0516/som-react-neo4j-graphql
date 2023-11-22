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
exports.aggregatePreComputedWhereFields = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const constants_1 = require("../constants");
const get_relationship_direction_1 = require("../utils/get-relationship-direction");
const map_to_db_property_1 = __importDefault(require("../utils/map-to-db-property"));
const utils_1 = require("../utils/utils");
const logical_operators_1 = require("./utils/logical-operators");
const create_comparison_operation_1 = require("./where/property-operations/create-comparison-operation");
const utils_2 = require("./where/utils");
function aggregatePreComputedWhereFields({ value, relationField, relationship, context, matchNode, }) {
    const refNode = context.nodes.find((x) => x.name === relationField.typeMeta.name);
    const direction = (0, get_relationship_direction_1.getCypherRelationshipDirection)(relationField);
    const aggregationTarget = new cypher_builder_1.default.Node({ labels: refNode.getLabels(context) });
    const cypherRelation = new cypher_builder_1.default.Relationship({
        type: relationField.type,
    });
    const matchPattern = new cypher_builder_1.default.Pattern(matchNode)
        .withoutLabels()
        .related(cypherRelation)
        .withDirection(direction)
        .to(aggregationTarget);
    const matchQuery = new cypher_builder_1.default.Match(matchPattern);
    const innerPredicate = aggregateWhere(value, refNode, relationship, aggregationTarget, cypherRelation);
    const predicateVariable = new cypher_builder_1.default.Variable();
    matchQuery.return([innerPredicate, predicateVariable]);
    const subquery = new cypher_builder_1.default.Call(matchQuery).innerWith(matchNode);
    return {
        predicate: cypher_builder_1.default.eq(predicateVariable, new cypher_builder_1.default.Literal(true)),
        // Cypher.concat is used because this is passed to createWherePredicate which expects a Cypher.CompositeClause
        preComputedSubqueries: cypher_builder_1.default.concat(subquery),
    };
}
exports.aggregatePreComputedWhereFields = aggregatePreComputedWhereFields;
function aggregateWhere(aggregateWhereInput, refNode, relationship, aggregationTarget, cypherRelation) {
    const innerPredicatesRes = [];
    Object.entries(aggregateWhereInput).forEach(([key, value]) => {
        if (constants_1.AGGREGATION_AGGREGATE_COUNT_OPERATORS.includes(key)) {
            const innerPredicate = createCountPredicateAndProjection(aggregationTarget, key, value);
            innerPredicatesRes.push(innerPredicate);
        }
        else if (constants_1.NODE_OR_EDGE_KEYS.includes(key)) {
            const target = key === "edge" ? cypherRelation : aggregationTarget;
            const refNodeOrRelation = key === "edge" ? relationship : refNode;
            if (!refNodeOrRelation)
                throw new Error(`Edge filter ${key} on undefined relationship`);
            const innerPredicate = aggregateEntityWhere(value, refNodeOrRelation, target);
            innerPredicatesRes.push(innerPredicate);
        }
        else if ((0, logical_operators_1.isLogicalOperator)(key)) {
            const logicalPredicates = [];
            (0, utils_1.asArray)(value).forEach((whereInput) => {
                const innerPredicate = aggregateWhere(whereInput, refNode, relationship, aggregationTarget, cypherRelation);
                logicalPredicates.push(innerPredicate);
            });
            const logicalPredicate = (0, logical_operators_1.getLogicalPredicate)(key, logicalPredicates);
            if (logicalPredicate) {
                innerPredicatesRes.push(logicalPredicate);
            }
        }
    });
    return cypher_builder_1.default.and(...innerPredicatesRes);
}
function createCountPredicateAndProjection(aggregationTarget, filterKey, filterValue) {
    const paramName = new cypher_builder_1.default.Param(filterValue);
    const count = cypher_builder_1.default.count(aggregationTarget);
    const operator = utils_2.whereRegEx.exec(filterKey)?.groups?.operator || "EQ";
    const operation = (0, create_comparison_operation_1.createBaseOperation)({
        operator,
        target: count,
        value: paramName,
    });
    return operation;
}
function aggregateEntityWhere(aggregateEntityWhereInput, refNodeOrRelation, target) {
    const innerPredicatesRes = [];
    Object.entries(aggregateEntityWhereInput).forEach(([key, value]) => {
        if ((0, logical_operators_1.isLogicalOperator)(key)) {
            const logicalPredicates = [];
            (0, utils_1.asArray)(value).forEach((whereInput) => {
                const innerPredicate = aggregateEntityWhere(whereInput, refNodeOrRelation, target);
                logicalPredicates.push(innerPredicate);
            });
            const logicalPredicate = (0, logical_operators_1.getLogicalPredicate)(key, logicalPredicates);
            if (logicalPredicate) {
                innerPredicatesRes.push(logicalPredicate);
            }
        }
        else {
            const operation = createEntityOperation(refNodeOrRelation, target, key, value);
            innerPredicatesRes.push(operation);
        }
    });
    return cypher_builder_1.default.and(...innerPredicatesRes);
}
function createEntityOperation(refNodeOrRelation, target, aggregationInputField, aggregationInputValue) {
    const paramName = new cypher_builder_1.default.Param(aggregationInputValue);
    const regexResult = utils_2.aggregationFieldRegEx.exec(aggregationInputField)?.groups;
    const { logicalOperator } = regexResult;
    const { fieldName, aggregationOperator } = regexResult;
    const fieldType = refNodeOrRelation?.primitiveFields.find((name) => name.fieldName === fieldName)?.typeMeta.name;
    if (fieldType === "String" && aggregationOperator) {
        return (0, create_comparison_operation_1.createBaseOperation)({
            operator: logicalOperator || "EQ",
            target: getAggregateOperation(cypher_builder_1.default.size(target.property(fieldName)), aggregationOperator),
            value: paramName,
        });
    }
    else if (aggregationOperator) {
        return (0, create_comparison_operation_1.createBaseOperation)({
            operator: logicalOperator || "EQ",
            target: getAggregateOperation(target.property(fieldName), aggregationOperator),
            value: paramName,
        });
    }
    else {
        const innerVar = new cypher_builder_1.default.Variable();
        const pointField = refNodeOrRelation.pointFields.find((x) => x.fieldName === fieldName);
        const durationField = refNodeOrRelation.primitiveFields.find((x) => x.fieldName === fieldName && x.typeMeta.name === "Duration");
        const innerOperation = (0, create_comparison_operation_1.createComparisonOperation)({
            operator: logicalOperator || "EQ",
            propertyRefOrCoalesce: innerVar,
            param: paramName,
            durationField,
            pointField,
        });
        const dbFieldName = (0, map_to_db_property_1.default)(refNodeOrRelation, fieldName);
        const collectedProperty = fieldType === "String" && logicalOperator !== "EQUAL"
            ? cypher_builder_1.default.collect(cypher_builder_1.default.size(target.property(dbFieldName)))
            : cypher_builder_1.default.collect(target.property(dbFieldName));
        return cypher_builder_1.default.any(innerVar, collectedProperty, innerOperation);
    }
}
function getAggregateOperation(property, aggregationOperator) {
    switch (aggregationOperator) {
        case "AVERAGE":
            return cypher_builder_1.default.avg(property);
        case "MIN":
        case "SHORTEST":
            return cypher_builder_1.default.min(property);
        case "MAX":
        case "LONGEST":
            return cypher_builder_1.default.max(property);
        case "SUM":
            return cypher_builder_1.default.sum(property);
        default:
            throw new Error(`Invalid operator ${aggregationOperator}`);
    }
}
//# sourceMappingURL=create-aggregate-where-and-params.js.map