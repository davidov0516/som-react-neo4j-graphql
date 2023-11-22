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
exports.generateSubscriptionConnectionWhereType = exports.generateSubscriptionWhereType = void 0;
const InterfaceEntityAdapter_1 = require("../../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../../schema-model/entity/model-adapters/UnionEntityAdapter");
const to_compose_1 = require("../to-compose");
const isEmptyObject = (obj) => !Object.keys(obj).length;
function generateSubscriptionWhereType(entityAdapter, schemaComposer) {
    if (schemaComposer.has(entityAdapter.operations.subscriptionWhereInputTypeName)) {
        return schemaComposer.getITC(entityAdapter.operations.subscriptionWhereInputTypeName);
    }
    const whereFields = (0, to_compose_1.attributesToSubscriptionsWhereInputFields)(entityAdapter);
    if (isEmptyObject(whereFields)) {
        return;
    }
    return schemaComposer.createInputTC({
        name: entityAdapter.operations.subscriptionWhereInputTypeName,
        fields: whereFields,
    });
}
exports.generateSubscriptionWhereType = generateSubscriptionWhereType;
function generateSubscriptionConnectionWhereType({ entityAdapter, schemaComposer, }) {
    const connectedRelationship = getRelationshipConnectionWhereTypes({
        entityAdapter,
        schemaComposer,
    });
    const isConnectedNodeTypeNotExcluded = schemaComposer.has(entityAdapter.operations.subscriptionWhereInputTypeName);
    if (!isConnectedNodeTypeNotExcluded && !connectedRelationship) {
        return;
    }
    const fieldName = entityAdapter.operations.subscriptionEventPayloadFieldNames.create_relationship;
    return {
        created: schemaComposer.createInputTC({
            name: entityAdapter.operations.relationshipCreatedSubscriptionWhereInputTypeName,
            fields: {
                AND: `[${entityAdapter.operations.relationshipCreatedSubscriptionWhereInputTypeName}!]`,
                OR: `[${entityAdapter.operations.relationshipCreatedSubscriptionWhereInputTypeName}!]`,
                NOT: entityAdapter.operations.relationshipCreatedSubscriptionWhereInputTypeName,
                ...(isConnectedNodeTypeNotExcluded && {
                    [fieldName]: schemaComposer.getITC(entityAdapter.operations.subscriptionWhereInputTypeName),
                }),
                ...(connectedRelationship && { createdRelationship: connectedRelationship }),
            },
        }),
        deleted: schemaComposer.createInputTC({
            name: entityAdapter.operations.relationshipDeletedSubscriptionWhereInputTypeName,
            fields: {
                AND: `[${entityAdapter.operations.relationshipDeletedSubscriptionWhereInputTypeName}!]`,
                OR: `[${entityAdapter.operations.relationshipDeletedSubscriptionWhereInputTypeName}!]`,
                NOT: entityAdapter.operations.relationshipDeletedSubscriptionWhereInputTypeName,
                ...(isConnectedNodeTypeNotExcluded && {
                    [fieldName]: schemaComposer.getITC(entityAdapter.operations.subscriptionWhereInputTypeName),
                }),
                ...(connectedRelationship && { deletedRelationship: connectedRelationship }),
            },
        }),
    };
}
exports.generateSubscriptionConnectionWhereType = generateSubscriptionConnectionWhereType;
function getRelationshipConnectionWhereTypes({ entityAdapter, schemaComposer, }) {
    const relationsFieldInputWhereTypeFields = Array.from(entityAdapter.relationships.values()).reduce((acc, relationshipAdapter) => {
        const fields = makeNodeRelationFields({
            relationshipAdapter,
            schemaComposer,
        });
        if (!fields) {
            return acc;
        }
        const relationFieldInputWhereType = schemaComposer.createInputTC({
            name: relationshipAdapter.operations.subscriptionWhereInputTypeName,
            fields,
        });
        acc[relationshipAdapter.name] = relationFieldInputWhereType;
        return acc;
    }, {});
    if (isEmptyObject(relationsFieldInputWhereTypeFields)) {
        return;
    }
    const relationsFieldInputWhereType = schemaComposer.createInputTC({
        name: entityAdapter.operations.relationshipsSubscriptionWhereInputTypeName,
        fields: relationsFieldInputWhereTypeFields,
    });
    return relationsFieldInputWhereType;
}
function makeNodeRelationFields({ relationshipAdapter, schemaComposer, }) {
    const edgeType = makeRelationshipWhereType({
        schemaComposer,
        relationshipAdapter,
    });
    const unionNode = relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter ? relationshipAdapter.target : undefined;
    if (unionNode) {
        const unionNodeTypes = unionNode.concreteEntities;
        return makeRelationshipToUnionTypeWhereType({ unionNodeTypes, schemaComposer, relationshipAdapter, edgeType });
    }
    const interfaceEntity = relationshipAdapter.target instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter ? relationshipAdapter.target : undefined;
    if (interfaceEntity) {
        return makeRelationshipToInterfaceTypeWhereType({
            schemaComposer,
            interfaceEntity,
            edgeType,
        });
    }
    return makeRelationshipToConcreteTypeWhereType({ relationshipAdapter, edgeType, schemaComposer });
}
function makeRelationshipWhereType({ schemaComposer, relationshipAdapter, }) {
    const relationProperties = relationshipAdapter.attributes;
    if (!relationProperties.size) {
        return undefined;
    }
    const composeFields = (0, to_compose_1.attributesToSubscriptionsWhereInputFields)(relationshipAdapter);
    // TODO: POINT was missing???
    return schemaComposer.getOrCreateITC(relationshipAdapter.operations.edgeSubscriptionWhereInputTypeName, (tc) => tc.addFields(composeFields));
}
function makeRelationshipToConcreteTypeWhereType({ relationshipAdapter, edgeType, schemaComposer, }) {
    const concreteTargetEntity = relationshipAdapter.target;
    const nodeExists = schemaComposer.has(concreteTargetEntity.operations.subscriptionWhereInputTypeName);
    if (!nodeExists && !edgeType) {
        return undefined;
    }
    return {
        ...(nodeExists && { node: concreteTargetEntity.operations.subscriptionWhereInputTypeName }),
        ...(edgeType && { edge: edgeType }),
    };
}
function makeRelationshipToUnionTypeWhereType({ unionNodeTypes, schemaComposer, relationshipAdapter, edgeType, }) {
    const unionTypes = unionNodeTypes.reduce((acc, concreteEntity) => {
        const nodeExists = schemaComposer.has(concreteEntity.operations.subscriptionWhereInputTypeName);
        if (!nodeExists && !edgeType) {
            return acc;
        }
        acc[concreteEntity.name] = schemaComposer.getOrCreateITC(relationshipAdapter.operations.getToUnionSubscriptionWhereInputTypeName(concreteEntity), (tc) => tc.addFields({
            ...(nodeExists && { node: concreteEntity.operations.subscriptionWhereInputTypeName }),
            ...(edgeType && { edge: edgeType }),
        }));
        return acc;
    }, {});
    if (isEmptyObject(unionTypes)) {
        return;
    }
    return unionTypes;
}
function makeRelationshipToInterfaceTypeWhereType({ schemaComposer, interfaceEntity, edgeType, }) {
    let interfaceImplementationsType = undefined;
    let interfaceNodeType = undefined;
    const implementationsFields = interfaceEntity.concreteEntities.reduce((acc, entity) => {
        if (schemaComposer.has(entity.operations.subscriptionWhereInputTypeName)) {
            acc[entity.name] = entity.operations.subscriptionWhereInputTypeName;
        }
        return acc;
    }, {});
    if (!isEmptyObject(implementationsFields)) {
        interfaceImplementationsType = schemaComposer.getOrCreateITC(interfaceEntity.operations.implementationsSubscriptionWhereInputTypeName, (tc) => tc.addFields(implementationsFields));
    }
    const interfaceFields = (0, to_compose_1.attributesToSubscriptionsWhereInputFields)(interfaceEntity);
    if (interfaceImplementationsType) {
        interfaceFields["_on"] = interfaceImplementationsType;
    }
    if (!isEmptyObject(interfaceFields)) {
        interfaceNodeType = schemaComposer.getOrCreateITC(interfaceEntity.operations.subscriptionWhereInputTypeName, (tc) => tc.addFields(interfaceFields));
    }
    if (!interfaceNodeType && !edgeType) {
        return;
    }
    return {
        ...(interfaceNodeType && { node: interfaceNodeType }),
        ...(edgeType && { edge: edgeType }),
    };
}
//# sourceMappingURL=generate-subscription-where-type.js.map