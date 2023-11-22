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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnectionFields = void 0;
const graphql_1 = require("graphql");
const classes_1 = require("../classes");
const constants_1 = require("../constants");
const PageInfo_1 = require("../graphql/objects/PageInfo");
const ConcreteEntityAdapter_1 = require("../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const InterfaceEntityAdapter_1 = require("../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../schema-model/entity/model-adapters/UnionEntityAdapter");
const constants_2 = require("./constants");
const directed_argument_1 = require("./directed-argument");
const augment_where_input_1 = require("./generation/augment-where-input");
const pagination_1 = require("./pagination");
const to_compose_1 = require("./to-compose");
function addConnectionSortField({ schemaComposer, relationshipAdapter, composeNodeArgs, }) {
    // TODO: This probably just needs to be
    // if (relationship.target.sortableFields.length) {}
    // And not care about the type of entity
    const targetIsInterfaceWithSortableFields = relationshipAdapter.target instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter &&
        schemaComposer.has(relationshipAdapter.target.operations.sortInputTypeName);
    const targetIsConcreteWithSortableFields = relationshipAdapter.target instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter && relationshipAdapter.target.sortableFields.length;
    const fields = {};
    if (targetIsInterfaceWithSortableFields || targetIsConcreteWithSortableFields) {
        fields["node"] = relationshipAdapter.target.operations.sortInputTypeName;
    }
    /*
        We include all properties here to maintain existing behaviour.
        In future sorting by arrays should become an aggregation sort because it sorts by the length of the array.
    */
    if (relationshipAdapter.propertiesTypeName) {
        // if (relationshipAdapter.sortableFields.length) {
        fields["edge"] = relationshipAdapter.operations.sortInputTypeName;
    }
    if (Object.keys(fields).length === 0) {
        return undefined;
    }
    const connectionSortITC = schemaComposer.getOrCreateITC(relationshipAdapter.operations.connectionSortInputTypename);
    connectionSortITC.addFields(fields);
    composeNodeArgs.sort = connectionSortITC.NonNull.List;
    return connectionSortITC;
}
function addConnectionWhereFields({ inputTypeComposer, relationshipAdapter, targetEntity, }) {
    inputTypeComposer.addFields({
        OR: inputTypeComposer.NonNull.List,
        AND: inputTypeComposer.NonNull.List,
        NOT: inputTypeComposer,
        node: targetEntity.operations.whereInputTypeName,
        node_NOT: {
            type: targetEntity.operations.whereInputTypeName,
            directives: [constants_2.DEPRECATE_NOT],
        },
    });
    if (relationshipAdapter.propertiesTypeName) {
        inputTypeComposer.addFields({
            edge: relationshipAdapter.operations.whereInputTypeName,
            edge_NOT: {
                type: relationshipAdapter.operations.whereInputTypeName,
                directives: [constants_2.DEPRECATE_NOT],
            },
        });
    }
}
function createConnectionFields({ entityAdapter, schemaComposer, composeNode, userDefinedFieldDirectives, relationshipFields, }) {
    const relationships = [];
    entityAdapter.relationships.forEach((relationship) => {
        const userDefinedDirectivesOnField = userDefinedFieldDirectives.get(relationship.name);
        const deprecatedDirectives = (0, to_compose_1.graphqlDirectivesToCompose)((userDefinedDirectivesOnField || []).filter((directive) => directive.name.value === constants_1.DEPRECATED));
        const connectionWhereITC = schemaComposer.getOrCreateITC(relationship.operations.connectionWhereInputTypename);
        const relationshipObjectType = schemaComposer.getOrCreateOTC(relationship.operations.relationshipFieldTypename, (tc) => {
            tc.addFields({
                cursor: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                node: `${relationship.target.name}!`,
            });
        });
        const connection = schemaComposer.getOrCreateOTC(relationship.operations.connectionFieldTypename, (tc) => {
            tc.addFields({
                edges: relationshipObjectType.NonNull.List.NonNull,
                totalCount: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                pageInfo: new graphql_1.GraphQLNonNull(PageInfo_1.PageInfo),
            });
        });
        if (relationship.propertiesTypeName) {
            const propertiesInterface = schemaComposer.getIFTC(relationship.propertiesTypeName);
            relationshipObjectType.addInterface(propertiesInterface);
            relationshipObjectType.addFields(propertiesInterface.getFields());
        }
        const fields = (0, augment_where_input_1.augmentWhereInputTypeWithConnectionFields)(relationship, deprecatedDirectives);
        const whereInputITC = schemaComposer.getITC(entityAdapter.operations.whereInputTypeName);
        whereInputITC.addFields(fields);
        const composeNodeArgs = (0, directed_argument_1.addDirectedArgument)({
            where: connectionWhereITC,
            first: {
                type: graphql_1.GraphQLInt,
            },
            after: {
                type: graphql_1.GraphQLString,
            },
        }, relationship);
        const relatedEntityIsUnionEntity = relationship.target instanceof UnionEntityAdapter_1.UnionEntityAdapter;
        if (relatedEntityIsUnionEntity) {
            relationship.target.concreteEntities.forEach((concreteEntity) => {
                const unionWhereName = relationship.operations.getConnectionUnionWhereInputTypename(concreteEntity);
                const unionWhereITC = schemaComposer.getOrCreateITC(unionWhereName);
                addConnectionWhereFields({
                    inputTypeComposer: unionWhereITC,
                    relationshipAdapter: relationship,
                    targetEntity: concreteEntity,
                });
                connectionWhereITC.addFields({
                    [concreteEntity.name]: unionWhereITC,
                });
            });
        }
        else {
            addConnectionWhereFields({
                inputTypeComposer: connectionWhereITC,
                relationshipAdapter: relationship,
                targetEntity: relationship.target,
            });
        }
        addConnectionSortField({
            schemaComposer,
            relationshipAdapter: relationship,
            composeNodeArgs,
        });
        // This needs to be done after the composeNodeArgs.sort is set (through addConnectionSortField for example)
        if (relationship.isReadable()) {
            composeNode.addFields({
                [relationship.operations.connectionFieldName]: {
                    type: connection.NonNull,
                    args: composeNodeArgs,
                    directives: deprecatedDirectives,
                    resolve: (source, args, _ctx, info) => {
                        return (0, pagination_1.connectionFieldResolver)({
                            connectionFieldName: relationship.operations.connectionFieldName,
                            args,
                            info,
                            source,
                        });
                    },
                },
            });
        }
        const relFields = relationship.propertiesTypeName
            ? relationshipFields.get(relationship.propertiesTypeName)
            : undefined;
        const r = new classes_1.Relationship({
            name: relationship.operations.relationshipFieldTypename,
            type: relationship.type,
            properties: relationship.propertiesTypeName,
            ...(relFields
                ? {
                    temporalFields: relFields.temporalFields,
                    scalarFields: relFields.scalarFields,
                    primitiveFields: relFields.primitiveFields,
                    enumFields: relFields.enumFields,
                    pointFields: relFields.pointFields,
                    customResolverFields: relFields.customResolverFields,
                }
                : {}),
        });
        relationships.push(r);
    });
    return relationships;
}
exports.createConnectionFields = createConnectionFields;
//# sourceMappingURL=create-connection-fields.js.map