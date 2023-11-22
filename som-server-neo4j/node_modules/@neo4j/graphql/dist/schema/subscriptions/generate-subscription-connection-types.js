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
exports.getConnectedTypes = exports.hasProperties = void 0;
const InterfaceEntityAdapter_1 = require("../../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../../schema-model/entity/model-adapters/UnionEntityAdapter");
const utils_1 = require("../../utils/utils");
const to_compose_1 = require("../to-compose");
function buildRelationshipDestinationUnionNodeType({ unionNodes, unionEntity, schemaComposer, }) {
    const atLeastOneTypeHasProperties = unionNodes.filter(hasProperties).length;
    if (!atLeastOneTypeHasProperties) {
        return null;
    }
    return schemaComposer.createUnionTC({
        name: unionEntity.operations.subscriptionEventPayloadTypeName,
        types: unionNodes,
    });
}
function buildRelationshipDestinationInterfaceNodeType({ interfaceEntity, interfaceNodes, schemaComposer, userDefinedFieldDirectivesForNode, }) {
    const userDefinedFieldDirectives = userDefinedFieldDirectivesForNode.get(interfaceEntity.name);
    if (!userDefinedFieldDirectives) {
        throw new Error("fix user directives for interface types in subscriptions.");
    }
    const interfaceConnectionComposeFields = (0, to_compose_1.relationshipAdapterToComposeFields)(Array.from(interfaceEntity.relationships.values()), userDefinedFieldDirectives);
    const interfaceComposeFields = (0, to_compose_1.attributeAdapterToComposeFields)(interfaceEntity.subscriptionEventPayloadFields, userDefinedFieldDirectives);
    if (Object.keys(interfaceComposeFields).length) {
        const nodeTo = schemaComposer.createInterfaceTC({
            name: interfaceEntity.operations.subscriptionEventPayloadTypeName,
            fields: interfaceComposeFields,
        });
        interfaceNodes?.forEach((interfaceNodeType) => {
            nodeTo.addTypeResolver(interfaceNodeType, () => true);
            interfaceNodeType.addFields(interfaceConnectionComposeFields);
        });
        return nodeTo;
    }
}
function buildRelationshipDestinationAbstractType({ relationshipAdapter, userDefinedFieldDirectivesForNode, schemaComposer, nodeNameToEventPayloadTypes, }) {
    const unionEntity = relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter ? relationshipAdapter.target : undefined;
    if (unionEntity) {
        const unionNodes = (0, utils_1.filterTruthy)(unionEntity?.concreteEntities?.map((unionEntity) => nodeNameToEventPayloadTypes[unionEntity.name]));
        return buildRelationshipDestinationUnionNodeType({ unionNodes, unionEntity, schemaComposer });
    }
    const interfaceEntity = relationshipAdapter.target instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter ? relationshipAdapter.target : undefined;
    if (interfaceEntity) {
        const interfaceNodes = (0, utils_1.filterTruthy)(interfaceEntity.concreteEntities.map((interfaceEntity) => nodeNameToEventPayloadTypes[interfaceEntity.name]));
        return buildRelationshipDestinationInterfaceNodeType({
            schemaComposer,
            interfaceEntity,
            interfaceNodes,
            userDefinedFieldDirectivesForNode,
        });
    }
    return undefined;
}
function buildRelationshipFieldDestinationTypes({ relationshipAdapter, userDefinedFieldDirectivesForNode, schemaComposer, nodeNameToEventPayloadTypes, }) {
    const nodeTo = nodeNameToEventPayloadTypes[relationshipAdapter.target.name];
    if (nodeTo) {
        // standard type
        return hasProperties(nodeTo) && nodeTo;
    }
    // union/interface type
    return buildRelationshipDestinationAbstractType({
        relationshipAdapter,
        userDefinedFieldDirectivesForNode,
        schemaComposer,
        nodeNameToEventPayloadTypes,
    });
}
function hasProperties(x) {
    return !!Object.keys(x.getFields()).length;
}
exports.hasProperties = hasProperties;
function getConnectedTypes({ entityAdapter, schemaComposer, nodeNameToEventPayloadTypes, userDefinedFieldDirectivesForNode, }) {
    // const { name, relationFields } = node;
    return Array.from(entityAdapter.relationships.values())
        .map((relationshipAdapter) => {
        const relationshipFieldType = schemaComposer.createObjectTC({
            name: relationshipAdapter.operations.subscriptionConnectedRelationshipTypeName,
        });
        const edgeProps = relationshipAdapter.subscriptionConnectedRelationshipFields;
        if (edgeProps.length) {
            const userDefinedFieldDirectives = userDefinedFieldDirectivesForNode.get(entityAdapter.name);
            if (!userDefinedFieldDirectives) {
                throw new Error("fix user directives for relationship properties interface types in subscriptions.");
            }
            const composeFields = (0, to_compose_1.attributeAdapterToComposeFields)(edgeProps, userDefinedFieldDirectives);
            relationshipFieldType.addFields(composeFields);
        }
        const nodeTo = buildRelationshipFieldDestinationTypes({
            relationshipAdapter,
            userDefinedFieldDirectivesForNode,
            schemaComposer,
            nodeNameToEventPayloadTypes,
        });
        if (nodeTo) {
            relationshipFieldType.addFields({ node: nodeTo.getTypeNonNull() });
        }
        return {
            relationshipFieldType,
            fieldName: relationshipAdapter.name,
        };
    })
        .reduce((acc, { relationshipFieldType, fieldName }) => {
        if (relationshipFieldType && hasProperties(relationshipFieldType)) {
            acc[fieldName] = relationshipFieldType;
        }
        return acc;
    }, {});
}
exports.getConnectedTypes = getConnectedTypes;
//# sourceMappingURL=generate-subscription-connection-types.js.map