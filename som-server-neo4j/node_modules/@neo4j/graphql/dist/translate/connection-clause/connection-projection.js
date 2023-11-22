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
exports.createEdgeProjection = void 0;
const utils_1 = require("@graphql-tools/utils");
const create_projection_and_params_1 = __importDefault(require("../create-projection-and-params"));
const create_relationship_property_element_1 = require("../projection/elements/create-relationship-property-element");
const resolveTree_1 = require("../utils/resolveTree");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
function createEdgeProjection({ resolveTree, field, relationshipRef, relatedNodeVariableName, context, relatedNode, resolveType, extraFields = [], cypherFieldAliasMap, }) {
    const connection = resolveTree.fieldsByTypeName[field.typeMeta.name];
    const edgeProjectionProperties = new cypher_builder_1.default.Map();
    const subqueries = [];
    const predicates = [];
    if (connection.edges) {
        const relationship = context.relationships.find((r) => r.name === field.relationshipTypeName);
        const relationshipFieldsByTypeName = connection.edges.fieldsByTypeName[field.relationshipTypeName];
        const relationshipProperties = Object.values(relationshipFieldsByTypeName).filter((v) => v.name !== "node");
        if (relationshipProperties.length || extraFields.length) {
            const relationshipPropertyEntries = relationshipProperties.filter((p) => p.name !== "cursor");
            for (const property of relationshipPropertyEntries) {
                const prop = (0, create_relationship_property_element_1.createRelationshipPropertyValue)({
                    resolveTree: property,
                    relationship,
                    relationshipVariable: relationshipRef,
                });
                edgeProjectionProperties.set(property.alias, prop);
            }
            for (const extraField of extraFields) {
                const prop = relationshipRef.property(extraField);
                edgeProjectionProperties.set(extraField, prop);
            }
        }
        const nodeField = Object.values(relationshipFieldsByTypeName).find((v) => v.name === "node");
        if (nodeField) {
            const nodeProjection = createConnectionNodeProjection({
                nodeResolveTree: nodeField,
                context,
                node: relatedNode,
                resolveTree,
                nodeRefVarName: relatedNodeVariableName,
                resolveType,
                cypherFieldAliasMap,
            });
            const alias = nodeField.alias;
            edgeProjectionProperties.set(alias, nodeProjection.projection);
            subqueries.push(...nodeProjection.subqueries);
            predicates.push(...nodeProjection.predicates);
        }
    }
    else {
        // This ensures that totalCount calculation is accurate if edges are not asked for
        return {
            projection: new cypher_builder_1.default.Map({
                node: new cypher_builder_1.default.Map({
                    __resolveType: new cypher_builder_1.default.Literal(relatedNode.name),
                    __id: cypher_builder_1.default.id(relatedNodeVariableName),
                }),
            }),
            subqueries,
            predicates,
        };
    }
    return { projection: edgeProjectionProperties, subqueries, predicates };
}
exports.createEdgeProjection = createEdgeProjection;
function createConnectionNodeProjection({ nodeResolveTree, nodeRefVarName, context, node, resolveType = false, resolveTree, cypherFieldAliasMap, }) {
    const selectedFields = (0, utils_1.mergeDeep)([
        nodeResolveTree.fieldsByTypeName[node.name],
        ...node.interfaces.map((i) => nodeResolveTree?.fieldsByTypeName[i.name.value]),
    ]);
    const sortInput = (resolveTree.args.sort ?? []);
    const nodeSortFields = sortInput.map(({ node: n = {} }) => Object.keys(n)).flat();
    const mergedResolveTree = (0, utils_1.mergeDeep)([
        nodeResolveTree,
        {
            ...nodeResolveTree,
            fieldsByTypeName: {
                [node.name]: (0, resolveTree_1.generateMissingOrAliasedFields)({
                    fieldNames: nodeSortFields,
                    selection: selectedFields,
                }),
            },
        },
    ]);
    const nodeProjectionAndParams = (0, create_projection_and_params_1.default)({
        resolveTree: mergedResolveTree,
        node,
        context,
        varName: nodeRefVarName,
        literalElements: true,
        resolveType,
        cypherFieldAliasMap,
    });
    const projectionSubqueries = [
        ...nodeProjectionAndParams.subqueriesBeforeSort,
        ...nodeProjectionAndParams.subqueries,
    ];
    return {
        subqueries: projectionSubqueries,
        predicates: nodeProjectionAndParams.predicates,
        projection: nodeProjectionAndParams.projection,
    };
}
//# sourceMappingURL=connection-projection.js.map