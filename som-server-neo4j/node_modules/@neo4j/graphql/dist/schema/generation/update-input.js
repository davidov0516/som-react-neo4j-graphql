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
exports.augmentUpdateInputTypeWithUpdateFieldInput = exports.withUpdateInputType = void 0;
const constants_1 = require("../../constants");
const ConcreteEntityAdapter_1 = require("../../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const InterfaceEntityAdapter_1 = require("../../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../../schema-model/entity/model-adapters/UnionEntityAdapter");
const RelationshipAdapter_1 = require("../../schema-model/relationship/model-adapters/RelationshipAdapter");
const to_compose_1 = require("../to-compose");
const connect_input_1 = require("./connect-input");
const disconnect_input_1 = require("./disconnect-input");
const delete_input_1 = require("./delete-input");
const implementation_inputs_1 = require("./implementation-inputs");
const where_input_1 = require("./where-input");
const connect_or_create_input_1 = require("./connect-or-create-input");
const relation_input_1 = require("./relation-input");
function withUpdateInputType({ entityAdapter, userDefinedFieldDirectives, composer, }) {
    const inputTypeName = entityAdapter instanceof RelationshipAdapter_1.RelationshipAdapter
        ? entityAdapter.operations.edgeUpdateInputTypeName
        : // : entityAdapter.operations.updateMutationArgumentNames.update; TODO
            entityAdapter.operations.updateInputTypeName;
    if (composer.has(inputTypeName)) {
        return composer.getITC(inputTypeName);
    }
    const updateInputType = composer.createInputTC({
        name: inputTypeName,
        fields: {},
    });
    if (entityAdapter instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter || entityAdapter instanceof RelationshipAdapter_1.RelationshipAdapter) {
        updateInputType.addFields((0, to_compose_1.concreteEntityToUpdateInputFields)(entityAdapter.updateInputFields, userDefinedFieldDirectives, [
            (0, to_compose_1.withMathOperators)(),
            (0, to_compose_1.withArrayOperators)(),
        ]));
    }
    else {
        updateInputType.addFields((0, to_compose_1.concreteEntityToUpdateInputFields)(entityAdapter.updateInputFields, userDefinedFieldDirectives, [
            (0, to_compose_1.withMathOperators)(),
        ]));
        const implementationsUpdateInputType = (0, implementation_inputs_1.makeImplementationsUpdateInput)({
            interfaceEntityAdapter: entityAdapter,
            composer,
        });
        updateInputType.addFields({ _on: implementationsUpdateInputType });
    }
    // ensureNonEmptyInput(composer, updateInputType); - not for relationshipAdapter
    return updateInputType;
}
exports.withUpdateInputType = withUpdateInputType;
function augmentUpdateInputTypeWithUpdateFieldInput({ relationshipAdapter, composer, userDefinedFieldDirectives, deprecatedDirectives, }) {
    if (relationshipAdapter.source instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        throw new Error("Unexpected union source");
    }
    const updateFieldInput = makeUpdateInputType({
        relationshipAdapter,
        composer,
        deprecatedDirectives,
        userDefinedFieldDirectives,
    });
    if (!updateFieldInput) {
        return;
    }
    const updateInput = withUpdateInputType({
        entityAdapter: relationshipAdapter.source,
        userDefinedFieldDirectives,
        composer,
    });
    const relationshipField = makeUpdateInputTypeRelationshipField({
        relationshipAdapter,
        updateFieldInput,
        deprecatedDirectives,
    });
    updateInput.addFields(relationshipField);
}
exports.augmentUpdateInputTypeWithUpdateFieldInput = augmentUpdateInputTypeWithUpdateFieldInput;
function makeUpdateInputType({ relationshipAdapter, composer, userDefinedFieldDirectives, deprecatedDirectives, }) {
    if (relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        return withUnionUpdateInputType({
            relationshipAdapter,
            composer,
            deprecatedDirectives,
            userDefinedFieldDirectives,
        });
    }
    return withUpdateFieldInputType({ relationshipAdapter, composer, userDefinedFieldDirectives });
}
function makeUpdateInputTypeRelationshipField({ relationshipAdapter, updateFieldInput, deprecatedDirectives, }) {
    if (relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        return {
            [relationshipAdapter.name]: {
                type: updateFieldInput,
                directives: deprecatedDirectives,
            },
        };
    }
    return {
        [relationshipAdapter.name]: {
            type: relationshipAdapter.isList ? updateFieldInput.NonNull.List : updateFieldInput,
            directives: deprecatedDirectives,
        },
    };
}
function withUpdateFieldInputType({ relationshipAdapter, composer, userDefinedFieldDirectives, ifUnionMemberEntity, }) {
    const typeName = relationshipAdapter.operations.getUpdateFieldInputTypeName(ifUnionMemberEntity);
    if (!relationshipAdapter.shouldGenerateUpdateFieldInputType(ifUnionMemberEntity)) {
        return;
    }
    if (!relationshipAdapter.isUpdatable()) {
        return;
    }
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const updateFieldInput = composer.createInputTC({
        name: typeName,
        fields: makeUpdateFieldInputTypeFields({
            relationshipAdapter,
            composer,
            userDefinedFieldDirectives,
            ifUnionMemberEntity,
        }),
    });
    return updateFieldInput;
}
function makeUpdateFieldInputTypeFields({ relationshipAdapter, composer, userDefinedFieldDirectives, ifUnionMemberEntity, }) {
    const fields = {};
    let connectOrCreateFieldInputType;
    let connectionWhereInputType;
    const relationshipTarget = relationshipAdapter.target;
    if (relationshipTarget instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter) {
        connectionWhereInputType = relationshipAdapter.operations.getConnectionWhereTypename();
        connectOrCreateFieldInputType = (0, connect_or_create_input_1.withConnectOrCreateFieldInputType)({
            relationshipAdapter,
            composer,
            userDefinedFieldDirectives,
        });
    }
    else if (relationshipTarget instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter) {
        connectionWhereInputType = relationshipAdapter.operations.getConnectionWhereTypename();
    }
    else {
        if (!ifUnionMemberEntity) {
            throw new Error("Member Entity required.");
        }
        connectionWhereInputType = (0, where_input_1.makeConnectionWhereInputType)({
            relationshipAdapter,
            memberEntity: ifUnionMemberEntity,
            composer,
        });
        connectOrCreateFieldInputType = (0, connect_or_create_input_1.withConnectOrCreateFieldInputType)({
            relationshipAdapter,
            composer,
            userDefinedFieldDirectives,
            ifUnionMemberEntity,
        });
    }
    if (connectionWhereInputType) {
        fields["where"] = {
            type: connectionWhereInputType,
            directives: [],
        };
    }
    if (connectOrCreateFieldInputType) {
        fields["connectOrCreate"] = {
            type: relationshipAdapter.isList
                ? connectOrCreateFieldInputType.NonNull.List
                : connectOrCreateFieldInputType,
            directives: [],
        };
    }
    const connectFieldInputType = (0, connect_input_1.withConnectFieldInputType)({ relationshipAdapter, ifUnionMemberEntity, composer });
    if (connectFieldInputType) {
        fields["connect"] = {
            type: relationshipAdapter.isList ? connectFieldInputType.NonNull.List : connectFieldInputType,
            directives: [],
        };
    }
    const disconnectFieldInputType = (0, disconnect_input_1.withDisconnectFieldInputType)({
        relationshipAdapter,
        ifUnionMemberEntity,
        composer,
    });
    if (disconnectFieldInputType) {
        fields["disconnect"] = {
            type: relationshipAdapter.isList ? disconnectFieldInputType.NonNull.List : disconnectFieldInputType,
            directives: [],
        };
    }
    const createFieldInputType = (0, relation_input_1.withCreateFieldInputType)({
        relationshipAdapter,
        ifUnionMemberEntity,
        composer,
        userDefinedFieldDirectives,
    });
    if (createFieldInputType) {
        fields["create"] = {
            type: relationshipAdapter.isList ? createFieldInputType.NonNull.List : createFieldInputType,
            directives: [],
        };
    }
    const updateFieldInputType = withUpdateConnectionFieldInputType({
        relationshipAdapter,
        ifUnionMemberEntity,
        composer,
        userDefinedFieldDirectives,
    });
    if (updateFieldInputType) {
        fields["update"] = {
            type: updateFieldInputType,
            directives: [],
        };
    }
    const deleteFieldInputType = (0, delete_input_1.withDeleteFieldInputType)({ relationshipAdapter, ifUnionMemberEntity, composer });
    if (deleteFieldInputType) {
        fields["delete"] = {
            type: relationshipAdapter.isList ? deleteFieldInputType.NonNull.List : deleteFieldInputType,
            directives: [],
        };
    }
    return fields;
}
function withUnionUpdateInputType({ relationshipAdapter, composer, deprecatedDirectives, userDefinedFieldDirectives, }) {
    const typeName = relationshipAdapter.operations.unionUpdateInputTypeName;
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const fields = makeUnionUpdateInputTypeFields({
        relationshipAdapter,
        composer,
        deprecatedDirectives,
        userDefinedFieldDirectives,
    });
    if (!Object.keys(fields).length) {
        return;
    }
    const updateInput = composer.createInputTC({
        name: typeName,
        fields,
    });
    return updateInput;
}
function makeUnionUpdateInputTypeFields({ relationshipAdapter, composer, deprecatedDirectives, userDefinedFieldDirectives, }) {
    const fields = {};
    if (!(relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter)) {
        throw new Error("Expected union target");
    }
    for (const memberEntity of relationshipAdapter.target.concreteEntities) {
        const fieldInput = withUpdateFieldInputType({
            relationshipAdapter,
            ifUnionMemberEntity: memberEntity,
            composer,
            userDefinedFieldDirectives,
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
function withUpdateConnectionFieldInputType({ relationshipAdapter, composer, userDefinedFieldDirectives, ifUnionMemberEntity, }) {
    const typeName = relationshipAdapter.operations.getUpdateConnectionInputTypename(ifUnionMemberEntity);
    if (!relationshipAdapter.nestedOperations.has(constants_1.RelationshipNestedOperationsOption.UPDATE)) {
        return;
    }
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const fields = makeUpdateConnectionFieldInputTypeFields({
        relationshipAdapter,
        composer,
        userDefinedFieldDirectives,
        ifUnionMemberEntity,
    });
    const updateFieldInput = composer.createInputTC({ name: typeName, fields });
    return updateFieldInput;
}
function makeUpdateConnectionFieldInputTypeFields({ relationshipAdapter, composer, userDefinedFieldDirectives, ifUnionMemberEntity, }) {
    const fields = {};
    if (relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        if (!ifUnionMemberEntity) {
            throw new Error("Expected member entity");
        }
        const updateInputType = withUpdateInputType({
            entityAdapter: ifUnionMemberEntity,
            userDefinedFieldDirectives,
            composer,
        });
        fields["node"] = updateInputType;
    }
    else {
        // TODO: we need to fix deprecatedDirectives before we can use the reference
        // const updateInputType = withUpdateInputType({
        //     entityAdapter: relationshipAdapter.target,
        //     userDefinedFieldDirectives,
        //     composer,
        // });
        // fields["node"] = updateInputType;
        fields["node"] = relationshipAdapter.target.operations.updateInputTypeName;
    }
    const hasNonGeneratedProperties = relationshipAdapter.nonGeneratedProperties.length > 0;
    if (hasNonGeneratedProperties) {
        fields["edge"] = relationshipAdapter.operations.edgeUpdateInputTypeName;
    }
    return fields;
}
//# sourceMappingURL=update-input.js.map