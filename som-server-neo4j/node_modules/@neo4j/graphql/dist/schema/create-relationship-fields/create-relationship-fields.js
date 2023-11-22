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
exports.createRelationshipFields = void 0;
const graphql_compose_1 = require("graphql-compose");
const constants_1 = require("../../constants");
const InterfaceEntityAdapter_1 = require("../../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../../schema-model/entity/model-adapters/UnionEntityAdapter");
const field_aggregation_composer_1 = require("../aggregations/field-aggregation-composer");
const directed_argument_1 = require("../directed-argument");
const augment_object_or_interface_1 = require("../generation/augment-object-or-interface");
const connect_input_1 = require("../generation/connect-input");
const connect_or_create_input_1 = require("../generation/connect-or-create-input");
const create_input_1 = require("../generation/create-input");
const delete_input_1 = require("../generation/delete-input");
const disconnect_input_1 = require("../generation/disconnect-input");
const relation_input_1 = require("../generation/relation-input");
const update_input_1 = require("../generation/update-input");
const where_input_1 = require("../generation/where-input");
const to_compose_1 = require("../to-compose");
const create_relationship_interface_fields_1 = require("./create-relationship-interface-fields");
const create_relationship_union_fields_1 = require("./create-relationship-union-fields");
function createRelationshipFields({ entityAdapter, schemaComposer, 
// TODO: Ideally we come up with a solution where we don't have to pass the following into these kind of functions
composeNode, 
// relationshipPropertyFields,
subgraph, userDefinedFieldDirectives, }) {
    if (!entityAdapter.relationships.size) {
        return;
    }
    entityAdapter.relationships.forEach((relationshipAdapter) => {
        if (!relationshipAdapter) {
            return;
        }
        const relationshipTarget = relationshipAdapter.target;
        if (relationshipTarget instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter) {
            (0, create_relationship_interface_fields_1.createRelationshipInterfaceFields)({
                relationship: relationshipAdapter,
                composeNode,
                schemaComposer,
                userDefinedFieldDirectives,
            });
            return;
        }
        if (relationshipTarget instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
            (0, create_relationship_union_fields_1.createRelationshipUnionFields)({
                relationship: relationshipAdapter,
                composeNode,
                schemaComposer,
                userDefinedFieldDirectives,
            });
            return;
        }
        const userDefinedDirectivesOnField = userDefinedFieldDirectives.get(relationshipAdapter.name);
        let deprecatedDirectives = [];
        if (userDefinedDirectivesOnField) {
            deprecatedDirectives = (0, to_compose_1.graphqlDirectivesToCompose)(userDefinedDirectivesOnField.filter((directive) => directive.name.value === constants_1.DEPRECATED));
        }
        // ======== only on relationships to concrete:
        (0, where_input_1.withSourceWhereInputType)({ relationshipAdapter, composer: schemaComposer, deprecatedDirectives });
        // TODO: new way
        if (composeNode instanceof graphql_compose_1.ObjectTypeComposer) {
            const fieldAggregationComposer = new field_aggregation_composer_1.FieldAggregationComposer(schemaComposer, subgraph);
            const aggregationTypeObject = fieldAggregationComposer.createAggregationTypeObject(relationshipAdapter);
            const aggregationFieldsBaseArgs = {
                where: relationshipTarget.operations.whereInputTypeName,
            };
            const aggregationFieldsArgs = (0, directed_argument_1.addDirectedArgument)(aggregationFieldsBaseArgs, relationshipAdapter);
            if (relationshipAdapter.aggregate) {
                composeNode.addFields({
                    [relationshipAdapter.operations.aggregateTypeName]: {
                        type: aggregationTypeObject,
                        args: aggregationFieldsArgs,
                        directives: deprecatedDirectives,
                    },
                });
            }
        }
        // ======== only on relationships to concrete | unions:
        // TODO: refactor
        (0, connect_or_create_input_1.withConnectOrCreateInputType)({
            relationshipAdapter,
            composer: schemaComposer,
            userDefinedFieldDirectives,
            deprecatedDirectives,
        });
        // ======== all relationships:
        composeNode.addFields((0, augment_object_or_interface_1.augmentObjectOrInterfaceTypeWithRelationshipField)(relationshipAdapter, userDefinedFieldDirectives, subgraph));
        (0, relation_input_1.withRelationInputType)({
            relationshipAdapter,
            composer: schemaComposer,
            deprecatedDirectives,
            userDefinedFieldDirectives,
        });
        (0, create_input_1.augmentCreateInputTypeWithRelationshipsInput)({
            relationshipAdapter,
            composer: schemaComposer,
            deprecatedDirectives,
            userDefinedFieldDirectives,
        });
        (0, connect_input_1.augmentConnectInputTypeWithConnectFieldInput)({
            relationshipAdapter,
            composer: schemaComposer,
            deprecatedDirectives,
        });
        (0, update_input_1.augmentUpdateInputTypeWithUpdateFieldInput)({
            relationshipAdapter,
            composer: schemaComposer,
            deprecatedDirectives,
            userDefinedFieldDirectives,
        });
        (0, delete_input_1.augmentDeleteInputTypeWithDeleteFieldInput)({
            relationshipAdapter,
            composer: schemaComposer,
            deprecatedDirectives,
        });
        (0, disconnect_input_1.augmentDisconnectInputTypeWithDisconnectFieldInput)({
            relationshipAdapter,
            composer: schemaComposer,
            deprecatedDirectives,
        });
    });
}
exports.createRelationshipFields = createRelationshipFields;
//# sourceMappingURL=create-relationship-fields.js.map