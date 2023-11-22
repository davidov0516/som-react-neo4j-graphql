"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCreateFieldInputType = exports.withRelationInputType = void 0;
const constants_1 = require("../../constants");
const ConcreteEntityAdapter_1 = require("../../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const InterfaceEntityAdapter_1 = require("../../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../../schema-model/entity/model-adapters/UnionEntityAdapter");
const create_input_1 = require("./create-input");
function withRelationInputType({ relationshipAdapter, composer, deprecatedDirectives, userDefinedFieldDirectives, }) {
    const relationshipSource = relationshipAdapter.source;
    if (relationshipSource instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        throw new Error("Unexpected union source");
    }
    const createFieldInputType = makeRelationFieldInputType({
        relationshipAdapter,
        composer,
        userDefinedFieldDirectives,
        deprecatedDirectives,
    });
    if (!createFieldInputType) {
        return;
    }
    const relationInput = composer.getOrCreateITC(relationshipSource.operations.relationInputTypeName);
    const relationshipField = makeRelationInputTypeRelationshipField({
        relationshipAdapter,
        createFieldInputType,
        deprecatedDirectives,
    });
    relationInput.addFields(relationshipField);
    return relationInput;
}
exports.withRelationInputType = withRelationInputType;
function makeRelationFieldInputType({ relationshipAdapter, composer, deprecatedDirectives, userDefinedFieldDirectives, }) {
    if (relationshipAdapter.target instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter) {
        return withCreateFieldInputType({ relationshipAdapter, composer, userDefinedFieldDirectives });
    }
    if (relationshipAdapter.target instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter) {
        return withCreateFieldInputType({ relationshipAdapter, composer, userDefinedFieldDirectives });
    }
    if (relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        return withUnionCreateFieldInputType({
            relationshipAdapter,
            composer,
            deprecatedDirectives,
            userDefinedFieldDirectives,
        });
    }
}
function makeRelationInputTypeRelationshipField({ relationshipAdapter, createFieldInputType, deprecatedDirectives, }) {
    if (relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter) {
        return {
            [relationshipAdapter.name]: {
                type: createFieldInputType,
                directives: deprecatedDirectives,
            },
        };
    }
    return {
        [relationshipAdapter.name]: {
            type: relationshipAdapter.isList ? createFieldInputType.NonNull.List : createFieldInputType,
            directives: deprecatedDirectives,
        },
    };
}
function withUnionCreateFieldInputType({ relationshipAdapter, composer, deprecatedDirectives, userDefinedFieldDirectives, }) {
    const typeName = relationshipAdapter.operations.unionCreateFieldInputTypeName;
    if (!(relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter)) {
        throw new Error("Expected union target");
    }
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const fields = makeUnionCreateFieldInputTypeFields({
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
function makeUnionCreateFieldInputTypeFields({ relationshipAdapter, composer, deprecatedDirectives, userDefinedFieldDirectives, }) {
    const fields = {};
    if (!(relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter)) {
        throw new Error("Expected union target");
    }
    for (const memberEntity of relationshipAdapter.target.concreteEntities) {
        const fieldInput = withCreateFieldInputType({
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
function withCreateFieldInputType({ relationshipAdapter, composer, ifUnionMemberEntity, userDefinedFieldDirectives, }) {
    const createName = relationshipAdapter.operations.getCreateFieldInputTypeName(ifUnionMemberEntity);
    if (!relationshipAdapter.nestedOperations.has(constants_1.RelationshipNestedOperationsOption.CREATE)) {
        return;
    }
    if (composer.has(createName)) {
        return composer.getITC(createName);
    }
    const createFieldInput = composer.createInputTC({
        name: createName,
        fields: makeCreateFieldInputTypeFields({
            relationshipAdapter,
            composer,
            ifUnionMemberEntity,
            userDefinedFieldDirectives,
        }),
    });
    return createFieldInput;
}
exports.withCreateFieldInputType = withCreateFieldInputType;
function makeCreateFieldInputTypeFields({ relationshipAdapter, composer, ifUnionMemberEntity, userDefinedFieldDirectives, }) {
    const fields = {};
    const hasNonGeneratedProperties = relationshipAdapter.nonGeneratedProperties.length > 0;
    if (hasNonGeneratedProperties) {
        fields["edge"] = relationshipAdapter.operations.edgeCreateInputTypeName;
    }
    if (relationshipAdapter.target instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter) {
        // tODO: fix deprecatedDirectives and use the reference here instead of string
        fields["node"] = `${relationshipAdapter.target.operations.createInputTypeName}!`;
    }
    else if (relationshipAdapter.target instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter) {
        const createInput = (0, create_input_1.withCreateInputType)({
            entityAdapter: relationshipAdapter.target,
            userDefinedFieldDirectives,
            composer,
        });
        if (createInput) {
            fields["node"] = createInput.NonNull;
        }
    }
    else {
        if (!ifUnionMemberEntity) {
            throw new Error("Member Entity required.");
        }
        const createInput = (0, create_input_1.withCreateInputType)({
            entityAdapter: ifUnionMemberEntity,
            userDefinedFieldDirectives,
            composer,
        });
        if (createInput) {
            fields["node"] = createInput.NonNull;
        }
    }
    return fields;
}
//# sourceMappingURL=relation-input.js.map