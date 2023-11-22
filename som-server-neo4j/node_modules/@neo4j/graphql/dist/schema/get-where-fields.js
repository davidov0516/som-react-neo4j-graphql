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
exports.getWhereFieldsForAttributes = void 0;
const constants_1 = require("../constants");
const constants_2 = require("./constants");
const to_compose_1 = require("./to-compose");
function getWhereFields({ typeName, fields, isInterface, features, }) {
    return {
        ...(isInterface ? {} : { OR: `[${typeName}Where!]`, AND: `[${typeName}Where!]`, NOT: `${typeName}Where` }),
        ...[
            ...fields.primitiveFields,
            ...fields.temporalFields,
            ...fields.enumFields,
            ...fields.pointFields,
            ...fields.scalarFields,
        ].reduce((res, f) => {
            if (f.filterableOptions.byValue === false) {
                return res;
            }
            const deprecatedDirectives = (0, to_compose_1.graphqlDirectivesToCompose)(f.otherDirectives.filter((directive) => directive.name.value === constants_1.DEPRECATED));
            res[f.fieldName] = {
                type: f.typeMeta.input.where.pretty,
                directives: deprecatedDirectives,
            };
            res[`${f.fieldName}_NOT`] = {
                type: f.typeMeta.input.where.pretty,
                directives: deprecatedDirectives.length ? deprecatedDirectives : [constants_2.DEPRECATE_NOT],
            };
            if (f.typeMeta.name === "Boolean") {
                return res;
            }
            if (f.typeMeta.array) {
                res[`${f.fieldName}_INCLUDES`] = {
                    type: f.typeMeta.input.where.type,
                    directives: deprecatedDirectives,
                };
                res[`${f.fieldName}_NOT_INCLUDES`] = {
                    type: f.typeMeta.input.where.type,
                    directives: deprecatedDirectives.length ? deprecatedDirectives : [constants_2.DEPRECATE_NOT],
                };
                return res;
            }
            res[`${f.fieldName}_IN`] = {
                type: `[${f.typeMeta.input.where.pretty}${f.typeMeta.required ? "!" : ""}]`,
                directives: deprecatedDirectives,
            };
            res[`${f.fieldName}_NOT_IN`] = {
                type: `[${f.typeMeta.input.where.pretty}${f.typeMeta.required ? "!" : ""}]`,
                directives: deprecatedDirectives.length ? deprecatedDirectives : [constants_2.DEPRECATE_NOT],
            };
            if ([
                "Float",
                "Int",
                "BigInt",
                "DateTime",
                "Date",
                "LocalDateTime",
                "Time",
                "LocalTime",
                "Duration",
            ].includes(f.typeMeta.name)) {
                ["_LT", "_LTE", "_GT", "_GTE"].forEach((comparator) => {
                    res[`${f.fieldName}${comparator}`] = { type: f.typeMeta.name, directives: deprecatedDirectives };
                });
                return res;
            }
            if (["Point", "CartesianPoint"].includes(f.typeMeta.name)) {
                ["_DISTANCE", "_LT", "_LTE", "_GT", "_GTE"].forEach((comparator) => {
                    res[`${f.fieldName}${comparator}`] = {
                        type: `${f.typeMeta.name}Distance`,
                        directives: deprecatedDirectives,
                    };
                });
                return res;
            }
            if (["String", "ID"].includes(f.typeMeta.name)) {
                const stringWhereOperators = [
                    { comparator: "_CONTAINS", typeName: f.typeMeta.name },
                    { comparator: "_STARTS_WITH", typeName: f.typeMeta.name },
                    { comparator: "_ENDS_WITH", typeName: f.typeMeta.name },
                ];
                const stringWhereOperatorsNegate = ["_NOT_CONTAINS", "_NOT_STARTS_WITH", "_NOT_ENDS_WITH"];
                Object.entries(features?.filters?.[f.typeMeta.name] || {}).forEach(([filter, enabled]) => {
                    if (enabled) {
                        if (filter === "MATCHES") {
                            stringWhereOperators.push({ comparator: `_${filter}`, typeName: "String" });
                        }
                        else {
                            stringWhereOperators.push({ comparator: `_${filter}`, typeName: f.typeMeta.name });
                        }
                    }
                });
                stringWhereOperators.forEach(({ comparator, typeName }) => {
                    res[`${f.fieldName}${comparator}`] = { type: typeName, directives: deprecatedDirectives };
                });
                stringWhereOperatorsNegate.forEach((comparator) => {
                    res[`${f.fieldName}${comparator}`] = {
                        type: f.typeMeta.name,
                        directives: deprecatedDirectives.length ? deprecatedDirectives : [constants_2.DEPRECATE_NOT],
                    };
                });
                return res;
            }
            return res;
        }, {}),
    };
}
exports.default = getWhereFields;
// TODO: refactoring needed!
// isWhereField, isFilterable, ... extracted out into attributes category
function getWhereFieldsForAttributes({ attributes, userDefinedFieldDirectives, features, }) {
    const result = {};
    // Add the where fields for each attribute
    for (const field of attributes) {
        const userDefinedDirectivesOnField = userDefinedFieldDirectives.get(field.name);
        const deprecatedDirectives = (0, to_compose_1.graphqlDirectivesToCompose)((userDefinedDirectivesOnField || []).filter((directive) => directive.name.value === constants_1.DEPRECATED));
        result[field.name] = {
            type: field.getInputTypeNames().where.pretty,
            directives: deprecatedDirectives,
        };
        result[`${field.name}_NOT`] = {
            type: field.getInputTypeNames().where.pretty,
            directives: deprecatedDirectives.length ? deprecatedDirectives : [constants_2.DEPRECATE_NOT],
        };
        // If the field is a boolean, skip it
        // This is done here because the previous additions are still added for boolean fields
        if (field.typeHelper.isBoolean()) {
            continue;
        }
        // If the field is an array, add the includes and not includes fields
        // if (field.isArray()) {
        if (field.typeHelper.isList()) {
            result[`${field.name}_INCLUDES`] = {
                type: field.getInputTypeNames().where.type,
                directives: deprecatedDirectives,
            };
            result[`${field.name}_NOT_INCLUDES`] = {
                type: field.getInputTypeNames().where.type,
                directives: deprecatedDirectives.length ? deprecatedDirectives : [constants_2.DEPRECATE_NOT],
            };
            continue;
        }
        // If the field is not an array, add the in and not in fields
        result[`${field.name}_IN`] = {
            type: field.getFilterableInputTypeName(),
            directives: deprecatedDirectives,
        };
        result[`${field.name}_NOT_IN`] = {
            type: field.getFilterableInputTypeName(),
            directives: deprecatedDirectives.length ? deprecatedDirectives : [constants_2.DEPRECATE_NOT],
        };
        // If the field is a number or temporal, add the comparison operators
        if (field.isNumericalOrTemporal()) {
            ["_LT", "_LTE", "_GT", "_GTE"].forEach((comparator) => {
                result[`${field.name}${comparator}`] = {
                    type: field.getInputTypeNames().where.type,
                    directives: deprecatedDirectives,
                };
            });
            continue;
        }
        // If the field is spatial, add the point comparison operators
        if (field.typeHelper.isSpatial()) {
            ["_DISTANCE", "_LT", "_LTE", "_GT", "_GTE"].forEach((comparator) => {
                result[`${field.name}${comparator}`] = {
                    type: `${field.getTypeName()}Distance`,
                    directives: deprecatedDirectives,
                };
            });
            continue;
        }
        // If the field is a string, add the string comparison operators
        if (field.typeHelper.isString() || field.typeHelper.isID()) {
            const stringWhereOperators = [
                { comparator: "_CONTAINS", typeName: field.getInputTypeNames().where.type },
                { comparator: "_STARTS_WITH", typeName: field.getInputTypeNames().where.type },
                { comparator: "_ENDS_WITH", typeName: field.getInputTypeNames().where.type },
            ];
            Object.entries(features?.filters?.[field.getInputTypeNames().where.type] || {}).forEach(([filter, enabled]) => {
                if (enabled) {
                    if (filter === "MATCHES") {
                        stringWhereOperators.push({ comparator: `_${filter}`, typeName: "String" });
                    }
                    else {
                        stringWhereOperators.push({
                            comparator: `_${filter}`,
                            typeName: field.getInputTypeNames().where.type,
                        });
                    }
                }
            });
            stringWhereOperators.forEach(({ comparator, typeName }) => {
                result[`${field.name}${comparator}`] = { type: typeName, directives: deprecatedDirectives };
            });
            ["_NOT_CONTAINS", "_NOT_STARTS_WITH", "_NOT_ENDS_WITH"].forEach((comparator) => {
                result[`${field.name}${comparator}`] = {
                    type: field.getInputTypeNames().where.type,
                    directives: deprecatedDirectives.length ? deprecatedDirectives : [constants_2.DEPRECATE_NOT],
                };
            });
        }
    }
    return result;
}
exports.getWhereFieldsForAttributes = getWhereFieldsForAttributes;
//# sourceMappingURL=get-where-fields.js.map