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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withArrayOperators = exports.withMathOperators = exports.concreteEntityToUpdateInputFields = exports.objectFieldsToUpdateInputFields = exports.attributesToSubscriptionsWhereInputFields = exports.objectFieldsToSubscriptionsWhereInputFields = exports.concreteEntityToCreateInputFields = exports.objectFieldsToCreateInputFields = exports.attributeAdapterToComposeFields = exports.relationshipAdapterToComposeFields = exports.objectFieldsToComposeFields = exports.graphqlDirectivesToCompose = exports.graphqlArgsToCompose = exports.graphqlInputValueToCompose = void 0;
const graphql_1 = require("graphql");
const constants_1 = require("../constants");
const ArgumentAdapter_1 = require("../schema-model/argument/model-adapters/ArgumentAdapter");
const parse_value_node_1 = require("../schema-model/parser/parse-value-node");
const RelationshipAdapter_1 = require("../schema-model/relationship/model-adapters/RelationshipAdapter");
const constants_2 = require("./constants");
const get_field_type_meta_1 = __importDefault(require("./get-field-type-meta"));
const id_1 = require("./resolvers/field/id");
const numerical_1 = require("./resolvers/field/numerical");
function graphqlInputValueToCompose(args) {
    return args.reduce((res, arg) => {
        const meta = (0, get_field_type_meta_1.default)(arg.type);
        return {
            ...res,
            [arg.name.value]: {
                type: meta.pretty,
                description: arg.description,
                ...(arg.defaultValue ? { defaultValue: (0, parse_value_node_1.parseValueNode)(arg.defaultValue) } : {}),
            },
        };
    }, {});
}
exports.graphqlInputValueToCompose = graphqlInputValueToCompose;
function graphqlArgsToCompose(args) {
    return args.reduce((res, arg) => {
        const inputValueAdapter = new ArgumentAdapter_1.ArgumentAdapter(arg);
        return {
            ...res,
            [arg.name]: {
                type: inputValueAdapter.getTypePrettyName(),
                description: inputValueAdapter.description,
                ...(inputValueAdapter.defaultValue !== undefined
                    ? { defaultValue: inputValueAdapter.defaultValue }
                    : {}),
            },
        };
    }, {});
}
exports.graphqlArgsToCompose = graphqlArgsToCompose;
function graphqlDirectivesToCompose(directives) {
    return directives.map((directive) => ({
        args: (directive.arguments || [])?.reduce((r, d) => ({ ...r, [d.name.value]: (0, parse_value_node_1.parseValueNode)(d.value) }), {}),
        name: directive.name.value,
    }));
}
exports.graphqlDirectivesToCompose = graphqlDirectivesToCompose;
function objectFieldsToComposeFields(fields) {
    return fields.reduce((res, field) => {
        if (field.writeonly || field.selectableOptions.onRead === false) {
            return res;
        }
        const newField = {
            type: field.typeMeta.pretty,
            args: {},
            description: field.description,
        };
        if (field.otherDirectives.length) {
            newField.directives = graphqlDirectivesToCompose(field.otherDirectives);
        }
        if (["Int", "Float"].includes(field.typeMeta.name)) {
            newField.resolve = numerical_1.numericalResolver;
        }
        if (field.typeMeta.name === "ID") {
            newField.resolve = id_1.idResolver;
        }
        if (field.arguments) {
            newField.args = graphqlInputValueToCompose(field.arguments);
        }
        return { ...res, [field.fieldName]: newField };
    }, {});
}
exports.objectFieldsToComposeFields = objectFieldsToComposeFields;
function relationshipAdapterToComposeFields(objectFields, userDefinedFieldDirectives) {
    const composeFields = {};
    for (const field of objectFields) {
        if (field.isReadable() === false) {
            continue;
        }
        const relationshipFields = [
            {
                typeName: field.operations.getTargetTypePrettyName(),
                fieldName: field.name,
            },
            {
                typeName: `${field.operations.connectionFieldTypename}!`,
                fieldName: field.operations.connectionFieldName,
            },
        ];
        for (const { typeName, fieldName } of relationshipFields) {
            const newField = {
                type: typeName,
                args: graphqlArgsToCompose(field.args),
                description: field.description,
            };
            const userDefinedDirectivesOnField = userDefinedFieldDirectives.get(field.name);
            if (userDefinedDirectivesOnField) {
                newField.directives = graphqlDirectivesToCompose(userDefinedDirectivesOnField);
            }
            composeFields[fieldName] = newField;
        }
    }
    return composeFields;
}
exports.relationshipAdapterToComposeFields = relationshipAdapterToComposeFields;
function attributeAdapterToComposeFields(objectFields, userDefinedFieldDirectives) {
    const composeFields = {};
    for (const field of objectFields) {
        if (field.isReadable() === false) {
            continue;
        }
        const newField = {
            type: field.getTypePrettyName(),
            args: {},
            description: field.description,
        };
        const userDefinedDirectivesOnField = userDefinedFieldDirectives.get(field.name);
        if (userDefinedDirectivesOnField) {
            newField.directives = graphqlDirectivesToCompose(userDefinedDirectivesOnField);
        }
        if (field.typeHelper.isInt() || field.typeHelper.isFloat()) {
            newField.resolve = numerical_1.numericalResolver;
        }
        if (field.typeHelper.isID()) {
            newField.resolve = id_1.idResolver;
        }
        if (field.args) {
            newField.args = graphqlArgsToCompose(field.args);
        }
        composeFields[field.name] = newField;
    }
    return composeFields;
}
exports.attributeAdapterToComposeFields = attributeAdapterToComposeFields;
function objectFieldsToCreateInputFields(fields) {
    return fields
        .filter((f) => {
        const isAutogenerate = f?.autogenerate;
        const isCallback = f?.callback;
        const isTemporal = f?.timestamps;
        const isSettable = f.settableOptions.onCreate;
        return !isAutogenerate && !isCallback && !isTemporal && isSettable;
    })
        .reduce((res, f) => {
        const fieldType = f.typeMeta.input.create.pretty;
        const defaultValue = f?.defaultValue;
        const deprecatedDirectives = graphqlDirectivesToCompose(f.otherDirectives.filter((directive) => directive.name.value === constants_1.DEPRECATED));
        if (defaultValue !== undefined) {
            res[f.fieldName] = {
                type: fieldType,
                defaultValue,
                directives: deprecatedDirectives,
            };
        }
        else {
            res[f.fieldName] = {
                type: fieldType,
                directives: deprecatedDirectives,
            };
        }
        return res;
    }, {});
}
exports.objectFieldsToCreateInputFields = objectFieldsToCreateInputFields;
function concreteEntityToCreateInputFields(objectFields, userDefinedFieldDirectives) {
    const createInputFields = {};
    for (const field of objectFields) {
        const newInputField = {
            type: field.getInputTypeNames().create.pretty,
            defaultValue: field.getDefaultValue(),
            directives: [],
        };
        const userDefinedDirectivesOnField = userDefinedFieldDirectives.get(field.name);
        if (userDefinedDirectivesOnField) {
            newInputField.directives = graphqlDirectivesToCompose(userDefinedDirectivesOnField.filter((directive) => directive.name.value === constants_1.DEPRECATED));
        }
        createInputFields[field.name] = newInputField;
    }
    return createInputFields;
}
exports.concreteEntityToCreateInputFields = concreteEntityToCreateInputFields;
function objectFieldsToSubscriptionsWhereInputFields(typeName, fields) {
    return fields.reduce((res, f) => {
        if (!f.filterableOptions.byValue) {
            return res;
        }
        const fieldType = f.typeMeta.input.where.pretty;
        const ifArrayOfAnyTypeExceptBoolean = f.typeMeta.array && f.typeMeta.name !== "Boolean";
        const ifAnyTypeExceptArrayAndBoolean = !f.typeMeta.array && f.typeMeta.name !== "Boolean";
        const isOneOfNumberTypes = ["Int", "Float", "BigInt"].includes(f.typeMeta.name) && !f.typeMeta.array;
        const isOneOfStringTypes = ["String", "ID"].includes(f.typeMeta.name) && !f.typeMeta.array;
        const isOneOfSpatialTypes = ["Point", "CartesianPoint"].includes(f.typeMeta.name);
        let inputTypeName = f.typeMeta.name;
        if (isOneOfSpatialTypes) {
            inputTypeName = `${inputTypeName}Input`;
        }
        return {
            ...res,
            AND: `[${typeName}SubscriptionWhere!]`,
            OR: `[${typeName}SubscriptionWhere!]`,
            NOT: `${typeName}SubscriptionWhere`,
            [f.fieldName]: fieldType,
            [`${f.fieldName}_NOT`]: {
                type: fieldType,
                directives: [constants_2.DEPRECATE_NOT],
            },
            ...(ifArrayOfAnyTypeExceptBoolean && {
                [`${f.fieldName}_INCLUDES`]: inputTypeName,
                [`${f.fieldName}_NOT_INCLUDES`]: {
                    type: inputTypeName,
                    directives: [constants_2.DEPRECATE_NOT],
                },
            }),
            ...(ifAnyTypeExceptArrayAndBoolean && {
                [`${f.fieldName}_IN`]: `[${inputTypeName}]`,
                [`${f.fieldName}_NOT_IN`]: {
                    type: `[${inputTypeName}]`,
                    directives: [constants_2.DEPRECATE_NOT],
                },
            }),
            ...(isOneOfNumberTypes && {
                [`${f.fieldName}_LT`]: fieldType,
                [`${f.fieldName}_LTE`]: fieldType,
                [`${f.fieldName}_GT`]: fieldType,
                [`${f.fieldName}_GTE`]: fieldType,
            }),
            ...(isOneOfStringTypes && {
                [`${f.fieldName}_STARTS_WITH`]: fieldType,
                [`${f.fieldName}_NOT_STARTS_WITH`]: {
                    type: fieldType,
                    directives: [constants_2.DEPRECATE_NOT],
                },
                [`${f.fieldName}_ENDS_WITH`]: fieldType,
                [`${f.fieldName}_NOT_ENDS_WITH`]: {
                    type: fieldType,
                    directives: [constants_2.DEPRECATE_NOT],
                },
                [`${f.fieldName}_CONTAINS`]: fieldType,
                [`${f.fieldName}_NOT_CONTAINS`]: {
                    type: fieldType,
                    directives: [constants_2.DEPRECATE_NOT],
                },
            }),
        };
    }, {});
}
exports.objectFieldsToSubscriptionsWhereInputFields = objectFieldsToSubscriptionsWhereInputFields;
function attributesToSubscriptionsWhereInputFields(entityWithAttributes) {
    return entityWithAttributes.subscriptionWhereFields.reduce((res, attribute) => {
        if (!attribute.isFilterable()) {
            return res;
        }
        const typeName = entityWithAttributes instanceof RelationshipAdapter_1.RelationshipAdapter
            ? entityWithAttributes.propertiesTypeName
            : entityWithAttributes.name;
        const fieldType = attribute.getInputTypeNames().where.pretty;
        const ifArrayOfAnyTypeExceptBoolean = attribute.typeHelper.isList() && attribute.getTypeName() !== "Boolean";
        const ifAnyTypeExceptArrayAndBoolean = !attribute.typeHelper.isList() && attribute.getTypeName() !== "Boolean";
        const isOneOfNumberTypes = ["Int", "Float", "BigInt"].includes(attribute.getTypeName()) && !attribute.typeHelper.isList();
        const isOneOfStringTypes = ["String", "ID"].includes(attribute.getTypeName()) && !attribute.typeHelper.isList();
        const isOneOfSpatialTypes = ["Point", "CartesianPoint"].includes(attribute.getTypeName());
        let inputTypeName = attribute.getTypeName();
        if (isOneOfSpatialTypes) {
            inputTypeName = `${inputTypeName}Input`;
        }
        return {
            ...res,
            AND: `[${typeName}SubscriptionWhere!]`,
            OR: `[${typeName}SubscriptionWhere!]`,
            NOT: `${typeName}SubscriptionWhere`,
            [attribute.name]: fieldType,
            [`${attribute.name}_NOT`]: {
                type: fieldType,
                directives: [constants_2.DEPRECATE_NOT],
            },
            ...(ifArrayOfAnyTypeExceptBoolean && {
                [`${attribute.name}_INCLUDES`]: inputTypeName,
                [`${attribute.name}_NOT_INCLUDES`]: {
                    type: inputTypeName,
                    directives: [constants_2.DEPRECATE_NOT],
                },
            }),
            ...(ifAnyTypeExceptArrayAndBoolean && {
                [`${attribute.name}_IN`]: `[${inputTypeName}]`,
                [`${attribute.name}_NOT_IN`]: {
                    type: `[${inputTypeName}]`,
                    directives: [constants_2.DEPRECATE_NOT],
                },
            }),
            ...(isOneOfNumberTypes && {
                [`${attribute.name}_LT`]: fieldType,
                [`${attribute.name}_LTE`]: fieldType,
                [`${attribute.name}_GT`]: fieldType,
                [`${attribute.name}_GTE`]: fieldType,
            }),
            ...(isOneOfStringTypes && {
                [`${attribute.name}_STARTS_WITH`]: fieldType,
                [`${attribute.name}_NOT_STARTS_WITH`]: {
                    type: fieldType,
                    directives: [constants_2.DEPRECATE_NOT],
                },
                [`${attribute.name}_ENDS_WITH`]: fieldType,
                [`${attribute.name}_NOT_ENDS_WITH`]: {
                    type: fieldType,
                    directives: [constants_2.DEPRECATE_NOT],
                },
                [`${attribute.name}_CONTAINS`]: fieldType,
                [`${attribute.name}_NOT_CONTAINS`]: {
                    type: fieldType,
                    directives: [constants_2.DEPRECATE_NOT],
                },
            }),
        };
    }, {});
}
exports.attributesToSubscriptionsWhereInputFields = attributesToSubscriptionsWhereInputFields;
function objectFieldsToUpdateInputFields(fields) {
    return fields.reduce((res, f) => {
        const deprecatedDirectives = graphqlDirectivesToCompose(f.otherDirectives.filter((directive) => directive.name.value === constants_1.DEPRECATED));
        const staticField = f.readonly || f?.autogenerate;
        const isSettable = f.settableOptions.onUpdate;
        if (staticField || !isSettable) {
            return res;
        }
        const fieldType = f.typeMeta.input.update.pretty;
        res[f.fieldName] = {
            type: fieldType,
            directives: deprecatedDirectives,
        };
        return res;
    }, {});
}
exports.objectFieldsToUpdateInputFields = objectFieldsToUpdateInputFields;
function concreteEntityToUpdateInputFields(objectFields, userDefinedFieldDirectives, additionalFieldsCallbacks = []) {
    let updateInputFields = {};
    for (const field of objectFields) {
        const newInputField = {
            type: field.getInputTypeNames().update.pretty,
            directives: [],
        };
        const userDefinedDirectivesOnField = userDefinedFieldDirectives.get(field.name);
        if (userDefinedDirectivesOnField) {
            newInputField.directives = graphqlDirectivesToCompose(userDefinedDirectivesOnField.filter((directive) => directive.name.value === constants_1.DEPRECATED));
        }
        updateInputFields[field.name] = newInputField;
        for (const cb of additionalFieldsCallbacks) {
            const additionalFields = cb(field, newInputField);
            updateInputFields = { ...updateInputFields, ...additionalFields };
        }
    }
    return updateInputFields;
}
exports.concreteEntityToUpdateInputFields = concreteEntityToUpdateInputFields;
function withMathOperators() {
    return (attribute, fieldDefinition) => {
        const fields = {};
        if (attribute.mathModel) {
            for (const operation of attribute.mathModel.getMathOperations()) {
                fields[operation] = fieldDefinition;
            }
        }
        return fields;
    };
}
exports.withMathOperators = withMathOperators;
function withArrayOperators() {
    return (attribute) => {
        const fields = {};
        if (attribute.listModel) {
            fields[attribute.listModel.getPop()] = graphql_1.GraphQLInt;
            fields[attribute.listModel.getPush()] = attribute.getInputTypeNames().update.pretty;
        }
        return fields;
    };
}
exports.withArrayOperators = withArrayOperators;
//# sourceMappingURL=to-compose.js.map