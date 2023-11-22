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
exports.withConnectFieldInputType = exports.augmentConnectInputTypeWithConnectFieldInput = exports.withConnectInputType = void 0;
const constants_1 = require("../../constants");
const ConcreteEntityAdapter_1 = require("../../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const InterfaceEntityAdapter_1 = require("../../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../../schema-model/entity/model-adapters/UnionEntityAdapter");
const overwrite_1 = require("../create-relationship-fields/fields/overwrite");
const implementation_inputs_1 = require("./implementation-inputs");
const utils_1 = require("./utils");
const where_input_1 = require("./where-input");
function withConnectInputType({ entityAdapter, composer, }) {
    if (entityAdapter instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter) {
        return composer.getOrCreateITC(entityAdapter.operations.connectInputTypeName);
    }
    const implementationsConnectInputType = (0, implementation_inputs_1.makeImplementationsConnectInput)({
        interfaceEntityAdapter: entityAdapter,
        composer,
    });
    if (!implementationsConnectInputType) {
        return undefined;
    }
    const connectInputType = composer.getOrCreateITC(entityAdapter.operations.connectInputTypeName);
    connectInputType.setField("_on", implementationsConnectInputType);
    return connectInputType;
}
exports.withConnectInputType = withConnectInputType;
function augmentConnectInputTypeWithConnectFieldInput({ relationshipAdapter, composer, deprecatedDirectives, }) {
    if (relationshipAdapter.source instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        throw new Error("Unexpected union source");
    }
    const connectFieldInput = makeConnectInputType({
        relationshipAdapter,
        composer,
        deprecatedDirectives,
    });
    if (!connectFieldInput) {
        return;
    }
    const connectInput = withConnectInputType({
        entityAdapter: relationshipAdapter.source,
        composer,
    });
    if (!connectInput) {
        return;
    }
    const relationshipField = makeConnectInputTypeRelationshipField({
        relationshipAdapter,
        connectFieldInput,
        deprecatedDirectives,
    });
    connectInput.addFields(relationshipField);
}
exports.augmentConnectInputTypeWithConnectFieldInput = augmentConnectInputTypeWithConnectFieldInput;
function makeConnectInputType({ relationshipAdapter, composer, deprecatedDirectives, }) {
    if (relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        return withUnionConnectInputType({ relationshipAdapter, composer, deprecatedDirectives });
    }
    return withConnectFieldInputType({ relationshipAdapter, composer });
}
function makeConnectInputTypeRelationshipField({ relationshipAdapter, connectFieldInput, deprecatedDirectives, }) {
    if (relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        return {
            [relationshipAdapter.name]: {
                type: connectFieldInput,
                directives: deprecatedDirectives,
            },
        };
    }
    return {
        [relationshipAdapter.name]: {
            type: relationshipAdapter.isList ? connectFieldInput.NonNull.List : connectFieldInput,
            directives: deprecatedDirectives,
        },
    };
}
function withUnionConnectInputType({ relationshipAdapter, composer, deprecatedDirectives, }) {
    const typeName = relationshipAdapter.operations.unionConnectInputTypeName;
    if (!relationshipAdapter.nestedOperations.has(constants_1.RelationshipNestedOperationsOption.CONNECT)) {
        return;
    }
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const fields = makeUnionConnectInputTypeFields({ relationshipAdapter, composer, deprecatedDirectives });
    if (!Object.keys(fields).length) {
        return;
    }
    const connectInput = composer.createInputTC({
        name: typeName,
        fields,
    });
    return connectInput;
}
function makeUnionConnectInputTypeFields({ relationshipAdapter, composer, deprecatedDirectives, }) {
    const fields = {};
    if (!(relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter)) {
        throw new Error("Expected union target");
    }
    for (const memberEntity of relationshipAdapter.target.concreteEntities) {
        const fieldInput = withConnectFieldInputType({
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
function withConnectFieldInputType({ relationshipAdapter, composer, ifUnionMemberEntity, }) {
    const typeName = relationshipAdapter.operations.getConnectFieldInputTypeName(ifUnionMemberEntity);
    if (!relationshipAdapter.nestedOperations.has(constants_1.RelationshipNestedOperationsOption.CONNECT)) {
        return;
    }
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const connectFieldInput = composer.createInputTC({
        name: typeName,
        fields: makeConnectFieldInputTypeFields({ relationshipAdapter, composer, ifUnionMemberEntity }),
    });
    return connectFieldInput;
}
exports.withConnectFieldInputType = withConnectFieldInputType;
function makeConnectFieldInputTypeFields({ relationshipAdapter, composer, ifUnionMemberEntity, }) {
    const fields = {};
    const hasNonGeneratedProperties = relationshipAdapter.nonGeneratedProperties.length > 0;
    if (hasNonGeneratedProperties) {
        fields["edge"] = relationshipAdapter.operations.edgeCreateInputTypeName;
    }
    if (relationshipAdapter.target instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter) {
        fields["where"] = (0, where_input_1.withConnectWhereFieldInputType)(relationshipAdapter.target, composer);
        fields["overwrite"] = overwrite_1.overwrite;
        if ((0, utils_1.relationshipTargetHasRelationshipWithNestedOperation)(relationshipAdapter.target, constants_1.RelationshipNestedOperationsOption.CONNECT)) {
            const connectInput = withConnectInputType({ entityAdapter: relationshipAdapter.target, composer });
            if (connectInput) {
                fields["connect"] = relationshipAdapter.isList ? connectInput.NonNull.List : connectInput;
            }
        }
    }
    else if (relationshipAdapter.target instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter) {
        fields["where"] = (0, where_input_1.withConnectWhereFieldInputType)(relationshipAdapter.target, composer);
        const connectInputType = withConnectInputType({ entityAdapter: relationshipAdapter.target, composer });
        if (connectInputType) {
            fields["connect"] = connectInputType;
        }
    }
    else {
        if (!ifUnionMemberEntity) {
            throw new Error("Member Entity required.");
        }
        fields["where"] = (0, where_input_1.withConnectWhereFieldInputType)(ifUnionMemberEntity, composer);
        if (ifUnionMemberEntity.relationships.size) {
            const connectInputType = withConnectInputType({ entityAdapter: ifUnionMemberEntity, composer });
            if (connectInputType) {
                fields["connect"] = relationshipAdapter.isList ? connectInputType.NonNull.List : connectInputType;
            }
        }
    }
    return fields;
}
//# sourceMappingURL=connect-input.js.map