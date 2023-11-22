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
exports.withFieldInputType = exports.augmentCreateInputTypeWithRelationshipsInput = exports.withCreateInputType = void 0;
const ConcreteEntityAdapter_1 = require("../../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const InterfaceEntityAdapter_1 = require("../../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../../schema-model/entity/model-adapters/UnionEntityAdapter");
const RelationshipAdapter_1 = require("../../schema-model/relationship/model-adapters/RelationshipAdapter");
const to_compose_1 = require("../to-compose");
const connect_input_1 = require("./connect-input");
const connect_or_create_input_1 = require("./connect-or-create-input");
const relation_input_1 = require("./relation-input");
function withCreateInputType({ entityAdapter, userDefinedFieldDirectives, composer, }) {
    if (composer.has(entityAdapter.operations.createInputTypeName)) {
        return composer.getITC(entityAdapter.operations.createInputTypeName);
    }
    const createInputType = composer.createInputTC({
        name: entityAdapter.operations.createInputTypeName,
        fields: {},
    });
    if (entityAdapter instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter || entityAdapter instanceof RelationshipAdapter_1.RelationshipAdapter) {
        createInputType.addFields((0, to_compose_1.concreteEntityToCreateInputFields)(entityAdapter.createInputFields, userDefinedFieldDirectives));
    }
    else {
        createInputType.addFields(makeCreateInputFields(entityAdapter));
    }
    // ensureNonEmptyInput(composer, createInputType); - not for relationshipAdapter
    return createInputType;
}
exports.withCreateInputType = withCreateInputType;
function makeCreateInputFields(interfaceEntityAdapter) {
    const fields = {};
    for (const entityAdapter of interfaceEntityAdapter.concreteEntities) {
        fields[entityAdapter.name] = {
            type: entityAdapter.operations.createInputTypeName,
        };
    }
    return fields;
}
function augmentCreateInputTypeWithRelationshipsInput({ relationshipAdapter, composer, userDefinedFieldDirectives, deprecatedDirectives, }) {
    if (!relationshipAdapter.isCreatable()) {
        return;
    }
    if (relationshipAdapter.source instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter) {
        // Interface CreateInput does not require relationship input fields
        // These are specified on the concrete nodes.
        return;
    }
    const relationshipsInput = makeRelationshipsInputType({
        relationshipAdapter,
        composer,
        deprecatedDirectives,
        userDefinedFieldDirectives,
    });
    if (!relationshipsInput) {
        return;
    }
    const createInput = withCreateInputType({
        entityAdapter: relationshipAdapter.source,
        userDefinedFieldDirectives,
        composer,
    });
    if (!createInput) {
        return;
    }
    createInput.addFields({
        [relationshipAdapter.name]: {
            type: relationshipsInput,
            directives: deprecatedDirectives,
        },
    });
}
exports.augmentCreateInputTypeWithRelationshipsInput = augmentCreateInputTypeWithRelationshipsInput;
function makeRelationshipsInputType({ relationshipAdapter, composer, userDefinedFieldDirectives, deprecatedDirectives, }) {
    if (relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        return withUnionCreateInputType({
            relationshipAdapter,
            composer,
            deprecatedDirectives,
            userDefinedFieldDirectives,
        });
    }
    else {
        return withFieldInputType({ relationshipAdapter, composer, userDefinedFieldDirectives });
    }
}
function withUnionCreateInputType({ relationshipAdapter, composer, deprecatedDirectives, userDefinedFieldDirectives, }) {
    const typeName = relationshipAdapter.operations.unionCreateInputTypeName;
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const fields = makeUnionCreateInputTypeFields({
        relationshipAdapter,
        composer,
        deprecatedDirectives,
        userDefinedFieldDirectives,
    });
    if (!Object.keys(fields).length) {
        return;
    }
    const createInput = composer.createInputTC({
        name: typeName,
        fields,
    });
    return createInput;
}
function makeUnionCreateInputTypeFields({ relationshipAdapter, composer, deprecatedDirectives, userDefinedFieldDirectives, }) {
    const fields = {};
    if (!(relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter)) {
        throw new Error("Expected union target");
    }
    for (const memberEntity of relationshipAdapter.target.concreteEntities) {
        const fieldInput = withFieldInputType({
            relationshipAdapter,
            ifUnionMemberEntity: memberEntity,
            composer,
            userDefinedFieldDirectives,
        });
        if (fieldInput) {
            fields[memberEntity.name] = {
                type: fieldInput,
                directives: deprecatedDirectives,
            };
        }
    }
    return fields;
}
function withFieldInputType({ relationshipAdapter, composer, userDefinedFieldDirectives, ifUnionMemberEntity, }) {
    const typeName = relationshipAdapter.operations.getFieldInputTypeName(ifUnionMemberEntity);
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    if (!relationshipAdapter.shouldGenerateFieldInputType(ifUnionMemberEntity)) {
        return;
    }
    const fields = makeFieldInputTypeFields({
        relationshipAdapter,
        composer,
        userDefinedFieldDirectives,
        ifUnionMemberEntity,
    });
    if (!Object.keys(fields).length) {
        return;
    }
    const fieldInput = composer.createInputTC({
        name: typeName,
        fields,
    });
    return fieldInput;
}
exports.withFieldInputType = withFieldInputType;
function makeFieldInputTypeFields({ relationshipAdapter, composer, userDefinedFieldDirectives, ifUnionMemberEntity, }) {
    const fields = {};
    let connectOrCreateFieldInputType;
    if (relationshipAdapter.target instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter) {
        connectOrCreateFieldInputType = (0, connect_or_create_input_1.withConnectOrCreateFieldInputType)({
            relationshipAdapter,
            composer,
            userDefinedFieldDirectives,
        });
    }
    else if (relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        if (!ifUnionMemberEntity) {
            throw new Error("Member Entity required.");
        }
        connectOrCreateFieldInputType = (0, connect_or_create_input_1.withConnectOrCreateFieldInputType)({
            relationshipAdapter,
            composer,
            userDefinedFieldDirectives,
            ifUnionMemberEntity,
        });
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
    return fields;
}
//# sourceMappingURL=create-input.js.map