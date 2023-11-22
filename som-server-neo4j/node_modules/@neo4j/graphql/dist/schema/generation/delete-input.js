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
exports.withDeleteFieldInputType = exports.withUnionDeleteInputType = exports.augmentDeleteInputTypeWithDeleteFieldInput = exports.withDeleteInputType = void 0;
const constants_1 = require("../../constants");
const ConcreteEntityAdapter_1 = require("../../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const InterfaceEntityAdapter_1 = require("../../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../../schema-model/entity/model-adapters/UnionEntityAdapter");
const utils_1 = require("./utils");
const implementation_inputs_1 = require("./implementation-inputs");
const where_input_1 = require("./where-input");
function withDeleteInputType({ entityAdapter, composer, }) {
    if (entityAdapter instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter) {
        return composer.getOrCreateITC(entityAdapter.operations.updateMutationArgumentNames.delete);
    }
    const implementationsUpdateInputType = (0, implementation_inputs_1.makeImplementationsDeleteInput)({
        interfaceEntityAdapter: entityAdapter,
        composer,
    });
    if (!implementationsUpdateInputType) {
        return undefined;
    }
    const deleteInputType = composer.getOrCreateITC(entityAdapter.operations.updateMutationArgumentNames.delete);
    deleteInputType.setField("_on", implementationsUpdateInputType);
    return deleteInputType;
}
exports.withDeleteInputType = withDeleteInputType;
function augmentDeleteInputTypeWithDeleteFieldInput({ relationshipAdapter, composer, deprecatedDirectives, }) {
    if (relationshipAdapter.source instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        throw new Error("Unexpected union source");
    }
    const deleteFieldInput = makeDeleteInputType({
        relationshipAdapter,
        composer,
        deprecatedDirectives,
    });
    if (!deleteFieldInput) {
        return;
    }
    const deleteInput = withDeleteInputType({
        entityAdapter: relationshipAdapter.source,
        composer,
    });
    if (!deleteInput) {
        return;
    }
    const relationshipField = makeDeleteInputTypeRelationshipField({
        relationshipAdapter,
        deleteFieldInput,
        deprecatedDirectives,
    });
    deleteInput.addFields(relationshipField);
}
exports.augmentDeleteInputTypeWithDeleteFieldInput = augmentDeleteInputTypeWithDeleteFieldInput;
function makeDeleteInputType({ relationshipAdapter, composer, deprecatedDirectives, }) {
    if (relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        return withUnionDeleteInputType({ relationshipAdapter, composer, deprecatedDirectives });
    }
    return withDeleteFieldInputType({ relationshipAdapter, composer });
}
function makeDeleteInputTypeRelationshipField({ relationshipAdapter, deleteFieldInput, deprecatedDirectives, }) {
    if (relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        return {
            [relationshipAdapter.name]: {
                type: deleteFieldInput,
                directives: deprecatedDirectives,
            },
        };
    }
    return {
        [relationshipAdapter.name]: {
            type: relationshipAdapter.isList ? deleteFieldInput.NonNull.List : deleteFieldInput,
            directives: deprecatedDirectives,
        },
    };
}
function withUnionDeleteInputType({ relationshipAdapter, composer, deprecatedDirectives, }) {
    const typeName = relationshipAdapter.operations.unionDeleteInputTypeName;
    if (!relationshipAdapter.nestedOperations.has(constants_1.RelationshipNestedOperationsOption.DELETE)) {
        return;
    }
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const fields = makeUnionDeleteInputTypeFields({ relationshipAdapter, composer, deprecatedDirectives });
    if (!Object.keys(fields).length) {
        return;
    }
    const deleteInput = composer.createInputTC({
        name: typeName,
        fields,
    });
    return deleteInput;
}
exports.withUnionDeleteInputType = withUnionDeleteInputType;
function makeUnionDeleteInputTypeFields({ relationshipAdapter, composer, deprecatedDirectives, }) {
    const fields = {};
    if (!(relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter)) {
        throw new Error("Expected union target");
    }
    for (const memberEntity of relationshipAdapter.target.concreteEntities) {
        const fieldInput = withDeleteFieldInputType({
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
function withDeleteFieldInputType({ relationshipAdapter, composer, ifUnionMemberEntity, }) {
    const typeName = relationshipAdapter.operations.getDeleteFieldInputTypeName(ifUnionMemberEntity);
    if (!relationshipAdapter.nestedOperations.has(constants_1.RelationshipNestedOperationsOption.DELETE)) {
        return;
    }
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const disconnectFieldInput = composer.createInputTC({
        name: typeName,
        fields: makeDeleteFieldInputTypeFields({ relationshipAdapter, composer, ifUnionMemberEntity }),
    });
    return disconnectFieldInput;
}
exports.withDeleteFieldInputType = withDeleteFieldInputType;
function makeDeleteFieldInputTypeFields({ relationshipAdapter, composer, ifUnionMemberEntity, }) {
    const fields = {};
    if (relationshipAdapter.target instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter) {
        fields["where"] = relationshipAdapter.operations.getConnectionWhereTypename();
        if ((0, utils_1.relationshipTargetHasRelationshipWithNestedOperation)(relationshipAdapter.target, constants_1.RelationshipNestedOperationsOption.DELETE)) {
            const deleteInput = withDeleteInputType({ entityAdapter: relationshipAdapter.target, composer });
            if (deleteInput) {
                fields["delete"] = deleteInput;
            }
        }
    }
    else if (relationshipAdapter.target instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter) {
        fields["where"] = relationshipAdapter.operations.getConnectionWhereTypename();
        const deleteInput = withDeleteInputType({ entityAdapter: relationshipAdapter.target, composer });
        if (deleteInput) {
            fields["delete"] = deleteInput;
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
            const deleteInput = withDeleteInputType({ entityAdapter: ifUnionMemberEntity, composer });
            if (deleteInput) {
                fields["delete"] = deleteInput;
            }
        }
    }
    return fields;
}
//# sourceMappingURL=delete-input.js.map