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
exports.withDisconnectFieldInputType = exports.augmentDisconnectInputTypeWithDisconnectFieldInput = exports.withDisconnectInputType = void 0;
const constants_1 = require("../../constants");
const ConcreteEntityAdapter_1 = require("../../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const InterfaceEntityAdapter_1 = require("../../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../../schema-model/entity/model-adapters/UnionEntityAdapter");
const utils_1 = require("./utils");
const implementation_inputs_1 = require("./implementation-inputs");
const where_input_1 = require("./where-input");
function withDisconnectInputType({ entityAdapter, composer, }) {
    if (entityAdapter instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter) {
        return composer.getOrCreateITC(entityAdapter.operations.updateMutationArgumentNames.disconnect);
    }
    const implementationsDisconnectInputType = (0, implementation_inputs_1.makeImplementationsDisconnectInput)({
        interfaceEntityAdapter: entityAdapter,
        composer,
    });
    if (!implementationsDisconnectInputType) {
        return undefined;
    }
    const disconnectInputType = composer.getOrCreateITC(entityAdapter.operations.updateMutationArgumentNames.disconnect);
    disconnectInputType.setField("_on", implementationsDisconnectInputType);
    return disconnectInputType;
}
exports.withDisconnectInputType = withDisconnectInputType;
function augmentDisconnectInputTypeWithDisconnectFieldInput({ relationshipAdapter, composer, deprecatedDirectives, }) {
    if (relationshipAdapter.source instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        throw new Error("Unexpected union source");
    }
    const disconnectFieldInput = makeDisconnectInputType({
        relationshipAdapter,
        composer,
        deprecatedDirectives,
    });
    if (!disconnectFieldInput) {
        return;
    }
    const disconnectInput = withDisconnectInputType({
        entityAdapter: relationshipAdapter.source,
        composer,
    });
    if (!disconnectInput) {
        return;
    }
    const relationshipField = makeDisconnectInputTypeRelationshipField({
        relationshipAdapter,
        disconnectFieldInput,
        deprecatedDirectives,
    });
    disconnectInput.addFields(relationshipField);
}
exports.augmentDisconnectInputTypeWithDisconnectFieldInput = augmentDisconnectInputTypeWithDisconnectFieldInput;
function makeDisconnectInputType({ relationshipAdapter, composer, deprecatedDirectives, }) {
    if (relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        return withUnionDisconnectInputType({ relationshipAdapter, composer, deprecatedDirectives });
    }
    return withDisconnectFieldInputType({ relationshipAdapter, composer });
}
function makeDisconnectInputTypeRelationshipField({ relationshipAdapter, disconnectFieldInput, deprecatedDirectives, }) {
    if (relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        return {
            [relationshipAdapter.name]: {
                type: disconnectFieldInput,
                directives: deprecatedDirectives,
            },
        };
    }
    return {
        [relationshipAdapter.name]: {
            type: relationshipAdapter.isList ? disconnectFieldInput.NonNull.List : disconnectFieldInput,
            directives: deprecatedDirectives,
        },
    };
}
function withUnionDisconnectInputType({ relationshipAdapter, composer, deprecatedDirectives, }) {
    const typeName = relationshipAdapter.operations.unionDisconnectInputTypeName;
    if (!relationshipAdapter.nestedOperations.has(constants_1.RelationshipNestedOperationsOption.DISCONNECT)) {
        return;
    }
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const fields = makeUnionDisconnectInputTypeFields({ relationshipAdapter, composer, deprecatedDirectives });
    if (!Object.keys(fields).length) {
        return;
    }
    const disconnectInput = composer.createInputTC({
        name: typeName,
        fields,
    });
    return disconnectInput;
}
function makeUnionDisconnectInputTypeFields({ relationshipAdapter, composer, deprecatedDirectives, }) {
    const fields = {};
    if (!(relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter)) {
        throw new Error("Expected union target");
    }
    for (const memberEntity of relationshipAdapter.target.concreteEntities) {
        const fieldInput = withDisconnectFieldInputType({
            relationshipAdapter,
            ifUnionMemberEntity: memberEntity,
            composer,
        });
        if (fieldInput) {
            fields[memberEntity.name] = {
                type: relationshipAdapter.isList ? fieldInput.NonNull.List : fieldInput,
                directives: deprecatedDirectives,
            };
        }
    }
    return fields;
}
function withDisconnectFieldInputType({ relationshipAdapter, composer, ifUnionMemberEntity, }) {
    const typeName = relationshipAdapter.operations.getDisconnectFieldInputTypeName(ifUnionMemberEntity);
    if (!relationshipAdapter.nestedOperations.has(constants_1.RelationshipNestedOperationsOption.DISCONNECT)) {
        return;
    }
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const disconnectFieldInput = composer.createInputTC({
        name: typeName,
        fields: makeDisconnectFieldInputTypeFields({ relationshipAdapter, composer, ifUnionMemberEntity }),
    });
    return disconnectFieldInput;
}
exports.withDisconnectFieldInputType = withDisconnectFieldInputType;
function makeDisconnectFieldInputTypeFields({ relationshipAdapter, composer, ifUnionMemberEntity, }) {
    const fields = {};
    if (relationshipAdapter.target instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter) {
        fields["where"] = relationshipAdapter.operations.getConnectionWhereTypename();
        if ((0, utils_1.relationshipTargetHasRelationshipWithNestedOperation)(relationshipAdapter.target, constants_1.RelationshipNestedOperationsOption.DISCONNECT)) {
            const disconnectInput = withDisconnectInputType({ entityAdapter: relationshipAdapter.target, composer });
            if (disconnectInput) {
                fields["disconnect"] = disconnectInput;
            }
        }
    }
    else if (relationshipAdapter.target instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter) {
        fields["where"] = relationshipAdapter.operations.getConnectionWhereTypename();
        const disconnectInput = withDisconnectInputType({ entityAdapter: relationshipAdapter.target, composer });
        if (disconnectInput) {
            fields["disconnect"] = disconnectInput;
        }
    }
    else {
        if (!ifUnionMemberEntity) {
            throw new Error("Member Entity required.");
        }
        fields["where"] = (0, where_input_1.makeConnectionWhereInputType)({
            relationshipAdapter,
            memberEntity: ifUnionMemberEntity,
            composer,
        });
        if (ifUnionMemberEntity.relationships.size) {
            const disconnectInput = withDisconnectInputType({ entityAdapter: ifUnionMemberEntity, composer });
            if (disconnectInput) {
                fields["disconnect"] = disconnectInput;
            }
        }
    }
    return fields;
}
//# sourceMappingURL=disconnect-input.js.map