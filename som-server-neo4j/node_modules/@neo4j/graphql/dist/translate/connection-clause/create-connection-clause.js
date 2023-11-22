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
exports.createConnectionClause = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const utils_1 = require("../../utils/utils");
const create_connection_operation_1 = require("../where/property-operations/create-connection-operation");
const get_or_create_cypher_variable_1 = require("../utils/get-or-create-cypher-variable");
const create_sort_and_limit_1 = require("./create-sort-and-limit");
const create_edge_subquery_1 = require("./create-edge-subquery");
const check_authentication_1 = require("../authorization/check-authentication");
function createConnectionClause({ resolveTree, field, context, nodeVariable, returnVariable, cypherFieldAliasMap, }) {
    if (field.relationship.union || field.relationship.interface) {
        return createConnectionClauseForUnions({
            resolveTree,
            field,
            context,
            nodeVariable,
            returnVariable,
            cypherFieldAliasMap,
        });
    }
    const whereInput = resolveTree.args.where;
    const firstArg = resolveTree.args.first;
    const relatedNode = context.nodes.find((x) => x.name === field.relationship.typeMeta.name);
    (0, check_authentication_1.checkAuthentication)({ context, node: relatedNode, targetOperations: ["READ"] });
    const edgeItem = new cypher_builder_1.default.NamedVariable("edge");
    const edgeSubquery = (0, create_edge_subquery_1.createEdgeSubquery)({
        resolveTree,
        field,
        context,
        parentNode: nodeVariable,
        relatedNode,
        returnVariable: edgeItem,
        whereInput,
        cypherFieldAliasMap,
    });
    const edgesList = new cypher_builder_1.default.NamedVariable("edges");
    const totalCount = new cypher_builder_1.default.NamedVariable("totalCount");
    const withClause = new cypher_builder_1.default.With([cypher_builder_1.default.collect(edgeItem), edgesList]).with(edgesList, [
        cypher_builder_1.default.size(edgesList),
        totalCount,
    ]);
    // `first` specified on connection field in query needs to be compared with existing `@limit`-imposed limit
    const relatedFirstArg = relatedNode.limit ? relatedNode.limit.getLimit(firstArg) : firstArg;
    const withSortAfterUnwindClause = (0, create_sort_and_limit_1.createSortAndLimitProjection)({
        resolveTree,
        relationshipRef: edgeItem,
        nodeRef: edgeItem.property("node"),
        limit: relatedFirstArg,
    });
    let unwindSortClause;
    if (withSortAfterUnwindClause) {
        const sortedEdges = new cypher_builder_1.default.Variable();
        const unwind = new cypher_builder_1.default.Unwind([edgesList, edgeItem]);
        const collectEdges = new cypher_builder_1.default.Return([cypher_builder_1.default.collect(edgeItem), sortedEdges]);
        // This subquery (CALL) is required due to the edge case of having cardinality 0 in the Cypher Match
        unwindSortClause = new cypher_builder_1.default.Call(cypher_builder_1.default.concat(unwind, withSortAfterUnwindClause, collectEdges))
            .innerWith(edgesList)
            .with([sortedEdges, edgesList], totalCount);
    }
    const returnClause = new cypher_builder_1.default.Return([
        new cypher_builder_1.default.Map({
            edges: edgesList,
            totalCount,
        }),
        returnVariable,
    ]);
    return cypher_builder_1.default.concat(edgeSubquery, withClause, unwindSortClause, returnClause);
}
exports.createConnectionClause = createConnectionClause;
function createConnectionClauseForUnions({ resolveTree, field, context, nodeVariable, returnVariable, cypherFieldAliasMap, }) {
    const whereInput = resolveTree.args.where;
    const relatedNode = context.nodes.find((x) => x.name === field.relationship.typeMeta.name);
    const relatedNodes = field.relationship.union
        ? context.nodes.filter((n) => field.relationship.union?.nodes?.includes(n.name))
        : context.nodes.filter((x) => field.relationship?.interface?.implementations?.includes(x.name));
    const collectUnionVariable = new cypher_builder_1.default.NamedNode("edge");
    const subqueries = relatedNodes.map((subqueryRelatedNode) => {
        if (whereInput &&
            !Object.prototype.hasOwnProperty.call(whereInput, subqueryRelatedNode.name) && // Filter interfaces when a "where" does not match
            !(field.relationship.interface &&
                !field.relationship.interface?.implementations?.some((i) => Object.prototype.hasOwnProperty.call(whereInput, i)))) {
            return undefined;
        }
        return createConnectionSubquery({
            resolveTree,
            field,
            context,
            parentNode: nodeVariable,
            returnVariable: collectUnionVariable,
            relatedNode: subqueryRelatedNode,
            cypherFieldAliasMap,
        });
    });
    const unionClauses = new cypher_builder_1.default.Call(new cypher_builder_1.default.Union(...(0, utils_1.filterTruthy)(subqueries)));
    const edgesList = new cypher_builder_1.default.NamedVariable("edges");
    const edgeItem = new cypher_builder_1.default.NamedVariable("edge");
    const totalCount = new cypher_builder_1.default.NamedVariable("totalCount");
    const withEdgesAndTotalCount = new cypher_builder_1.default.With([cypher_builder_1.default.collect(collectUnionVariable), edgesList]).with(edgesList, [
        cypher_builder_1.default.size(edgesList),
        totalCount,
    ]);
    let withOrderClause;
    const limit = relatedNode?.limit?.getLimit();
    const withOrder = (0, create_sort_and_limit_1.createSortAndLimitProjection)({
        resolveTree,
        relationshipRef: edgeItem,
        nodeRef: edgeItem.property("node"),
        limit,
        extraFields: [totalCount],
    });
    if (withOrder) {
        const unwind = new cypher_builder_1.default.Unwind([edgesList, edgeItem]);
        const withAndCollectEdges = new cypher_builder_1.default.With([cypher_builder_1.default.collect(edgeItem), edgesList], totalCount);
        withOrderClause = cypher_builder_1.default.concat(unwind, withOrder, withAndCollectEdges);
    }
    const returnClause = new cypher_builder_1.default.Return([
        new cypher_builder_1.default.Map({
            edges: edgesList,
            totalCount,
        }),
        returnVariable,
    ]);
    return cypher_builder_1.default.concat(unionClauses, withEdgesAndTotalCount, withOrderClause, returnClause);
}
function createConnectionSubquery({ resolveTree, field, context, parentNode, relatedNode, returnVariable, cypherFieldAliasMap, }) {
    const parentNodeRef = (0, get_or_create_cypher_variable_1.getOrCreateCypherNode)(parentNode);
    const withClause = new cypher_builder_1.default.With(parentNodeRef);
    const whereInput = resolveTree.args.where;
    const unionInterfaceWhere = field.relationship.union ? (whereInput || {})[relatedNode.name] : whereInput || {};
    if (unionInterfaceWhere) {
        if (!(0, create_connection_operation_1.hasExplicitNodeInInterfaceWhere)({
            whereInput: unionInterfaceWhere,
            node: relatedNode,
        })) {
            return undefined;
        }
    }
    const edgeSubquery = (0, create_edge_subquery_1.createEdgeSubquery)({
        resolveTree,
        field,
        context,
        parentNode,
        relatedNode,
        returnVariable,
        whereInput: unionInterfaceWhere,
        resolveType: true,
        ignoreSort: true,
        cypherFieldAliasMap,
    });
    if (!edgeSubquery)
        return undefined;
    const returnClause = new cypher_builder_1.default.Return(returnVariable);
    return cypher_builder_1.default.concat(withClause, edgeSubquery, returnClause);
}
//# sourceMappingURL=create-connection-clause.js.map