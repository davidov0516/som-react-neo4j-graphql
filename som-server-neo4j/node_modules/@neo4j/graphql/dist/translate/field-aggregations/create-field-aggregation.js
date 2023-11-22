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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFieldAggregation = void 0;
const utils_1 = require("./utils");
const AggregationSubQueries = __importStar(require("./aggregation-sub-queries"));
const field_aggregations_auth_1 = require("./field-aggregations-auth");
const aggregation_sub_queries_1 = require("./aggregation-sub-queries");
const map_to_db_property_1 = __importDefault(require("../../utils/map-to-db-property"));
const field_aggregation_composer_1 = require("../../schema/aggregations/field-aggregation-composer");
const upper_first_1 = require("../../utils/upper-first");
const get_relationship_direction_1 = require("../../utils/get-relationship-direction");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_where_predicate_1 = require("../where/create-where-predicate");
const check_authentication_1 = require("../authorization/check-authentication");
function createFieldAggregation({ context, nodeVar, node, field, }) {
    const relationAggregationField = node.relationFields.find((x) => {
        return `${x.fieldName}Aggregate` === field.name;
    });
    const connectionField = node.connectionFields.find((x) => {
        return `${relationAggregationField?.fieldName}Connection` === x.fieldName;
    });
    if (!relationAggregationField || !connectionField)
        return undefined;
    const referenceNode = (0, utils_1.getReferenceNode)(context, relationAggregationField);
    const referenceRelation = (0, utils_1.getReferenceRelation)(context, connectionField);
    if (!referenceNode || !referenceRelation)
        return undefined;
    (0, check_authentication_1.checkAuthentication)({ context, node: referenceNode, targetOperations: ["AGGREGATE"] });
    const sourceRef = nodeVar;
    const targetRef = new cypher_builder_1.default.Node({ labels: referenceNode.getLabels(context) });
    const fieldPathBase = `${node.name}${referenceNode.name}${(0, upper_first_1.upperFirst)(relationAggregationField.fieldName)}`;
    const aggregationFields = getAggregationFields(fieldPathBase, field);
    const predicates = [];
    let preComputedSubqueries;
    const authData = (0, field_aggregations_auth_1.createFieldAggregationAuth)({
        node: referenceNode,
        context,
        subqueryNodeAlias: targetRef,
    });
    if (authData) {
        const { predicate: authorizationPredicate, preComputedSubqueries: authorizationPreComputedSubqueries } = authData;
        if (authorizationPredicate) {
            predicates.push(authorizationPredicate);
        }
        if (authorizationPreComputedSubqueries && !authorizationPreComputedSubqueries.empty) {
            preComputedSubqueries = cypher_builder_1.default.concat(preComputedSubqueries, authorizationPreComputedSubqueries);
        }
    }
    const { predicate: wherePredicate, preComputedSubqueries: wherePreComputedSubqueries } = (0, create_where_predicate_1.createWherePredicate)({
        targetElement: targetRef,
        whereInput: field.args.where || {},
        context,
        element: referenceNode,
    });
    if (wherePredicate) {
        predicates.push(wherePredicate);
    }
    if (wherePreComputedSubqueries && !wherePreComputedSubqueries.empty) {
        preComputedSubqueries = cypher_builder_1.default.concat(preComputedSubqueries, wherePreComputedSubqueries);
    }
    const relationshipDirection = (0, get_relationship_direction_1.getCypherRelationshipDirection)(relationAggregationField, {
        directed: field.args.directed,
    });
    const relationship = new cypher_builder_1.default.Relationship({ type: relationAggregationField.type });
    const targetPattern = new cypher_builder_1.default.Pattern(sourceRef)
        .related(relationship)
        .withDirection(relationshipDirection)
        .to(targetRef);
    const matchWherePattern = (0, aggregation_sub_queries_1.createMatchWherePattern)(targetPattern, preComputedSubqueries, cypher_builder_1.default.and(...predicates));
    const projectionMap = new cypher_builder_1.default.Map();
    let projectionSubqueries;
    const countRef = new cypher_builder_1.default.Variable();
    let countFunction;
    if (aggregationFields.count) {
        countFunction = cypher_builder_1.default.count(targetRef);
        projectionMap.set({
            count: countRef,
        });
        projectionSubqueries = new cypher_builder_1.default.Call(cypher_builder_1.default.concat(matchWherePattern, new cypher_builder_1.default.Return([countFunction, countRef]))).innerWith(sourceRef);
    }
    const nodeFields = aggregationFields.node;
    if (nodeFields) {
        const { innerProjectionMap: nodeProjectionMap, innerProjectionSubqueries } = getAggregationProjectionAndSubqueries({
            referenceNodeOrRelationship: referenceNode,
            matchWherePattern,
            targetRef,
            sourceRef,
            fields: nodeFields,
        });
        projectionSubqueries = cypher_builder_1.default.concat(projectionSubqueries, innerProjectionSubqueries);
        projectionMap.set({ node: nodeProjectionMap });
    }
    const edgeFields = aggregationFields.edge;
    if (edgeFields) {
        const { innerProjectionMap: edgeProjectionMap, innerProjectionSubqueries } = getAggregationProjectionAndSubqueries({
            referenceNodeOrRelationship: referenceRelation,
            matchWherePattern,
            targetRef: relationship,
            sourceRef,
            fields: edgeFields,
        });
        projectionSubqueries = cypher_builder_1.default.concat(projectionSubqueries, innerProjectionSubqueries);
        projectionMap.set({ edge: edgeProjectionMap });
    }
    return {
        projectionCypher: projectionMap,
        projectionSubqueryCypher: projectionSubqueries || new cypher_builder_1.default.RawCypher(""),
    };
}
exports.createFieldAggregation = createFieldAggregation;
function getAggregationProjectionAndSubqueries({ referenceNodeOrRelationship, matchWherePattern, targetRef, sourceRef, fields, }) {
    let innerProjectionSubqueries;
    const innerProjectionMap = new cypher_builder_1.default.Map();
    Object.values(fields).forEach((field) => {
        const dbProperty = (0, map_to_db_property_1.default)(referenceNodeOrRelationship, field.name);
        const fieldType = (0, utils_1.getFieldType)(field);
        const fieldName = dbProperty || field.name;
        const fieldRef = new cypher_builder_1.default.Variable();
        innerProjectionMap.set(field.name, fieldRef);
        const subquery = getAggregationSubquery({
            matchWherePattern,
            fieldName,
            fieldRef,
            type: fieldType,
            targetAlias: targetRef,
        });
        innerProjectionSubqueries = cypher_builder_1.default.concat(innerProjectionSubqueries, new cypher_builder_1.default.Call(subquery).innerWith(sourceRef));
    });
    if (!innerProjectionSubqueries) {
        innerProjectionSubqueries = new cypher_builder_1.default.RawCypher("");
    }
    return { innerProjectionMap, innerProjectionSubqueries };
}
function getAggregationFields(fieldPathBase, field) {
    const aggregationFields = field.fieldsByTypeName[`${fieldPathBase}${field_aggregation_composer_1.FieldAggregationSchemaTypes.field}`];
    const node = (0, utils_1.getFieldByName)("node", aggregationFields)?.fieldsByTypeName[`${fieldPathBase}${field_aggregation_composer_1.FieldAggregationSchemaTypes.node}`];
    const edge = (0, utils_1.getFieldByName)("edge", aggregationFields)?.fieldsByTypeName[`${fieldPathBase}${field_aggregation_composer_1.FieldAggregationSchemaTypes.edge}`];
    const count = (0, utils_1.getFieldByName)("count", aggregationFields);
    return { count, edge, node };
}
function getAggregationSubquery({ matchWherePattern, fieldName, fieldRef, type, targetAlias, }) {
    switch (type) {
        case utils_1.AggregationType.String:
        case utils_1.AggregationType.Id:
            return AggregationSubQueries.stringAggregationQuery(matchWherePattern, fieldName, fieldRef, targetAlias);
        case utils_1.AggregationType.Int:
        case utils_1.AggregationType.BigInt:
        case utils_1.AggregationType.Float:
            return AggregationSubQueries.numberAggregationQuery(matchWherePattern, fieldName, fieldRef, targetAlias);
        case utils_1.AggregationType.DateTime:
            return AggregationSubQueries.dateTimeAggregationQuery(matchWherePattern, fieldName, fieldRef, targetAlias);
        default:
            return AggregationSubQueries.defaultAggregationQuery(matchWherePattern, fieldName, fieldRef, targetAlias);
    }
}
//# sourceMappingURL=create-field-aggregation.js.map