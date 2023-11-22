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
const graphql_1 = require("graphql");
const get_alias_meta_1 = __importDefault(require("./get-alias-meta"));
const get_cypher_meta_1 = require("./get-cypher-meta");
const get_field_type_meta_1 = __importDefault(require("./get-field-type-meta"));
const get_custom_resolver_meta_1 = require("./get-custom-resolver-meta");
const get_relationship_meta_1 = __importDefault(require("./get-relationship-meta"));
const get_unique_meta_1 = __importDefault(require("./parse/get-unique-meta"));
const constants_1 = require("../constants");
const parse_value_node_1 = require("../schema-model/parser/parse-value-node");
const upper_first_1 = require("../utils/upper-first");
const get_populated_by_meta_1 = require("./get-populated-by-meta");
const parse_arguments_1 = require("../schema-model/parser/parse-arguments");
function getObjFieldMeta({ obj, objects, interfaces, scalars, unions, enums, callbacks, customResolvers, }) {
    const objInterfaceNames = [...(obj.interfaces || [])];
    const objInterfaces = interfaces.filter((i) => objInterfaceNames.map((n) => n.name.value).includes(i.name.value));
    return obj?.fields?.reduce((res, field) => {
        const interfaceField = objInterfaces
            .find((i) => i.fields?.map((f) => f.name.value).includes(field.name.value))
            ?.fields?.find((f) => f.name.value === field.name.value);
        // Create array of directives for this field. Field directives override interface field directives.
        const directives = [
            ...(field?.directives || []),
            ...(interfaceField?.directives || []).filter((d) => !field.directives?.find((fd) => fd.name.value === d.name.value)),
        ];
        if (directives.some((x) => x.name.value === "private")) {
            return res;
        }
        const relationshipMeta = (0, get_relationship_meta_1.default)(field, interfaceField);
        const cypherMeta = (0, get_cypher_meta_1.getCypherMeta)(field, interfaceField);
        const customResolverMeta = (0, get_custom_resolver_meta_1.getCustomResolverMeta)({
            field,
            object: obj,
            objects,
            interfaces,
            unions,
            customResolvers,
            interfaceField,
        });
        const typeMeta = (0, get_field_type_meta_1.default)(field.type);
        const idDirective = directives.find((x) => x.name.value === "id");
        const relayIdDirective = directives.find((x) => x.name.value === "relayId");
        const defaultDirective = directives.find((x) => x.name.value === "default");
        const coalesceDirective = directives.find((x) => x.name.value === "coalesce");
        const timestampDirective = directives.find((x) => x.name.value === "timestamp");
        const aliasDirective = directives.find((x) => x.name.value === "alias");
        const populatedByDirective = directives.find((x) => x.name.value === "populatedBy");
        const selectableDirective = directives.find((x) => x.name.value === "selectable");
        const settableDirective = directives.find((x) => x.name.value === "settable");
        const filterableDirective = directives.find((x) => x.name.value === "filterable");
        const unique = (0, get_unique_meta_1.default)(directives, obj, field.name.value);
        const fieldInterface = interfaces.find((x) => x.name.value === typeMeta.name);
        const fieldUnion = unions.find((x) => x.name.value === typeMeta.name);
        const fieldScalar = scalars.find((x) => x.name.value === typeMeta.name);
        const fieldEnum = enums.find((x) => x.name.value === typeMeta.name);
        const fieldObject = objects.find((x) => x.name.value === typeMeta.name);
        const fieldTemporal = constants_1.TEMPORAL_SCALAR_TYPES.includes(typeMeta.name);
        const fieldPoint = constants_1.SPATIAL_TYPES.includes(typeMeta.name);
        const selectableOptions = parseSelectableDirective(selectableDirective);
        const settableOptions = parseSettableDirective(settableDirective);
        const filterableOptions = parseFilterableDirective(filterableDirective);
        const baseField = {
            fieldName: field.name.value,
            dbPropertyName: field.name.value,
            typeMeta,
            selectableOptions,
            settableOptions,
            filterableOptions,
            otherDirectives: (directives || []).filter((x) => ![
                "relationship",
                "cypher",
                "id",
                "authorization",
                "authentication",
                "readonly",
                "writeonly",
                "customResolver",
                "default",
                "coalesce",
                "timestamp",
                "alias",
                "unique",
                "callback",
                "populatedBy",
                "jwtClaim",
                "selectable",
                "settable",
                "subscriptionsAuthorization",
                "filterable",
                "relayId",
            ].includes(x.name.value)),
            arguments: [...(field.arguments || [])],
            description: field.description?.value,
            readonly: directives.some((d) => d.name.value === "readonly") ||
                interfaceField?.directives?.some((x) => x.name.value === "readonly"),
            writeonly: directives.some((d) => d.name.value === "writeonly") ||
                interfaceField?.directives?.some((x) => x.name.value === "writeonly"),
            ...(unique ? { unique } : {}),
        };
        if (aliasDirective) {
            const aliasMeta = (0, get_alias_meta_1.default)(aliasDirective);
            if (aliasMeta) {
                baseField.dbPropertyName = aliasMeta.property;
                baseField.dbPropertyNameUnescaped = aliasMeta.propertyUnescaped;
            }
        }
        if (relationshipMeta) {
            const relationField = {
                ...baseField,
                ...relationshipMeta,
                inherited: false,
            };
            if (fieldUnion) {
                const nodes = [];
                fieldUnion.types?.forEach((type) => {
                    nodes.push(type.name.value);
                });
                const unionField = {
                    ...baseField,
                    nodes,
                };
                relationField.union = unionField;
            }
            if (fieldInterface) {
                const implementations = objects
                    .filter((n) => n.interfaces?.some((i) => i.name.value === fieldInterface.name.value))
                    .map((n) => n.name.value);
                relationField.interface = {
                    ...baseField,
                    implementations,
                };
            }
            // TODO: This will be brittle if more than one interface
            let connectionPrefix = obj.name.value;
            if (obj.interfaces && obj.interfaces.length) {
                const firstInterface = obj.interfaces[0];
                if (!firstInterface) {
                    throw new Error("Cannot get interface in getObjFieldMeta");
                }
                const inter = interfaces.find((i) => i.name.value === firstInterface.name.value);
                if (inter.fields?.some((f) => f.name.value === baseField.fieldName)) {
                    connectionPrefix = firstInterface.name.value;
                    relationField.inherited = true;
                }
            }
            relationField.connectionPrefix = connectionPrefix;
            const connectionTypeName = `${connectionPrefix}${(0, upper_first_1.upperFirst)(`${baseField.fieldName}Connection`)}`;
            const relationshipTypeName = `${connectionPrefix}${(0, upper_first_1.upperFirst)(`${baseField.fieldName}Relationship`)}`;
            const connectionField = {
                fieldName: `${baseField.fieldName}Connection`,
                relationshipTypeName,
                selectableOptions,
                settableOptions,
                filterableOptions,
                typeMeta: {
                    name: connectionTypeName,
                    required: true,
                    pretty: `${connectionTypeName}!`,
                    input: {
                        where: {
                            type: `${connectionTypeName}Where`,
                            pretty: `${connectionTypeName}Where`,
                        },
                        create: {
                            type: "",
                            pretty: "",
                        },
                        update: {
                            type: "",
                            pretty: "",
                        },
                    },
                },
                otherDirectives: baseField.otherDirectives,
                arguments: [...(field.arguments || [])],
                description: field.description?.value,
                relationship: relationField,
            };
            res.relationFields.push(relationField);
            res.connectionFields.push(connectionField);
            // }
        }
        else if (cypherMeta) {
            const cypherField = {
                ...baseField,
                ...cypherMeta,
                isEnum: !!fieldEnum,
                isScalar: !!fieldScalar || constants_1.SCALAR_TYPES.includes(typeMeta.name),
            };
            res.cypherFields.push(cypherField);
        }
        else if (customResolverMeta) {
            res.customResolverFields.push({ ...baseField, ...customResolverMeta });
        }
        else if (fieldScalar) {
            const scalarField = {
                ...baseField,
            };
            res.scalarFields.push(scalarField);
        }
        else if (fieldEnum) {
            const enumField = {
                kind: "Enum",
                ...baseField,
            };
            if (defaultDirective) {
                const defaultValue = defaultDirective.arguments?.find((a) => a.name.value === "value")?.value;
                if (enumField.typeMeta.array) {
                    enumField.defaultValue = defaultValue.values.map((v) => {
                        return v.value;
                    });
                }
                else {
                    enumField.defaultValue = defaultValue.value;
                }
            }
            if (coalesceDirective) {
                const coalesceValue = coalesceDirective.arguments?.find((a) => a.name.value === "value")?.value;
                if (enumField.typeMeta.array) {
                    enumField.coalesceValue = coalesceValue.values.map((v) => {
                        return v.value;
                    });
                }
                else {
                    // TODO: avoid duplication with primitives
                    enumField.coalesceValue = `"${coalesceValue.value}"`;
                }
            }
            res.enumFields.push(enumField);
        }
        else if (fieldUnion) {
            const unionField = {
                ...baseField,
            };
            res.unionFields.push(unionField);
        }
        else if (fieldInterface) {
            res.interfaceFields.push({
                ...baseField,
            });
        }
        else if (fieldObject) {
            const objectField = {
                ...baseField,
            };
            res.objectFields.push(objectField);
        }
        else {
            if (fieldTemporal) {
                const temporalField = {
                    ...baseField,
                };
                if (timestampDirective) {
                    const operations = timestampDirective?.arguments?.find((x) => x.name.value === "operations")
                        ?.value;
                    const timestamps = operations
                        ? operations?.values.map((x) => (0, parse_value_node_1.parseValueNode)(x))
                        : ["CREATE", "UPDATE"];
                    temporalField.timestamps = timestamps;
                }
                if (defaultDirective) {
                    const value = defaultDirective.arguments?.find((a) => a.name.value === "value")?.value;
                    temporalField.defaultValue = value.value;
                }
                res.temporalFields.push(temporalField);
            }
            else if (fieldPoint) {
                const pointField = {
                    ...baseField,
                };
                res.pointFields.push(pointField);
            }
            else {
                const primitiveField = {
                    ...baseField,
                };
                if (populatedByDirective) {
                    const callback = (0, get_populated_by_meta_1.getPopulatedByMeta)(populatedByDirective, callbacks);
                    primitiveField.callback = callback;
                }
                if (idDirective) {
                    const autogenerate = idDirective.arguments?.find((a) => a.name.value === "autogenerate");
                    if (!autogenerate || autogenerate.value.value) {
                        primitiveField.autogenerate = true;
                    }
                }
                if (relayIdDirective) {
                    primitiveField.isGlobalIdField = true;
                }
                if (defaultDirective) {
                    const value = defaultDirective.arguments?.find((a) => a.name.value === "value")?.value;
                    const typeError = `Default value for ${obj.name.value}.${primitiveField.fieldName} does not have matching type ${primitiveField.typeMeta.name}`;
                    switch (baseField.typeMeta.name) {
                        case "ID":
                        case "String":
                            if (value?.kind !== graphql_1.Kind.STRING) {
                                throw new Error(typeError);
                            }
                            primitiveField.defaultValue = value.value;
                            break;
                        case "Boolean":
                            if (value?.kind !== graphql_1.Kind.BOOLEAN) {
                                throw new Error(typeError);
                            }
                            primitiveField.defaultValue = value.value;
                            break;
                        case "Int":
                            if (value?.kind !== graphql_1.Kind.INT) {
                                throw new Error(typeError);
                            }
                            primitiveField.defaultValue = parseInt(value.value, 10);
                            break;
                        case "Float":
                            if (value?.kind !== graphql_1.Kind.FLOAT) {
                                throw new Error(typeError);
                            }
                            primitiveField.defaultValue = parseFloat(value.value);
                            break;
                        default:
                            throw new Error("@default directive can only be used on types: Int | Float | String | Boolean | ID | DateTime | Enum");
                    }
                }
                if (coalesceDirective) {
                    const value = coalesceDirective.arguments?.find((a) => a.name.value === "value")?.value;
                    const typeError = `coalesce() value for ${obj.name.value}.${primitiveField.fieldName} does not have matching type ${primitiveField.typeMeta.name}`;
                    switch (baseField.typeMeta.name) {
                        case "ID":
                        case "String":
                            if (value?.kind !== graphql_1.Kind.STRING) {
                                throw new Error(typeError);
                            }
                            primitiveField.coalesceValue = `"${value.value}"`;
                            break;
                        case "Boolean":
                            if (value?.kind !== graphql_1.Kind.BOOLEAN) {
                                throw new Error(typeError);
                            }
                            primitiveField.coalesceValue = value.value;
                            break;
                        case "Int":
                            if (value?.kind !== graphql_1.Kind.INT) {
                                throw new Error(typeError);
                            }
                            primitiveField.coalesceValue = parseInt(value.value, 10);
                            break;
                        case "Float":
                            if (value?.kind !== graphql_1.Kind.FLOAT) {
                                throw new Error(typeError);
                            }
                            primitiveField.coalesceValue = parseFloat(value.value);
                            break;
                        default:
                            throw new Error("@coalesce directive can only be used on types: Int | Float | String | Boolean | ID | DateTime");
                    }
                }
                res.primitiveFields.push(primitiveField);
            }
        }
        return res;
    }, {
        relationFields: [],
        connectionFields: [],
        primitiveFields: [],
        cypherFields: [],
        scalarFields: [],
        enumFields: [],
        unionFields: [],
        interfaceFields: [],
        objectFields: [],
        temporalFields: [],
        pointFields: [],
        customResolverFields: [],
    });
}
exports.default = getObjFieldMeta;
function parseSelectableDirective(directive) {
    const defaultArguments = {
        onRead: true,
        onAggregate: true,
    };
    const args = directive ? (0, parse_arguments_1.parseArgumentsFromUnknownDirective)(directive) : {};
    return {
        onRead: args.onRead ?? defaultArguments.onRead,
        onAggregate: args.onAggregate ?? defaultArguments.onAggregate,
    };
}
function parseSettableDirective(directive) {
    const defaultArguments = {
        onCreate: true,
        onUpdate: true,
    };
    const args = directive ? (0, parse_arguments_1.parseArgumentsFromUnknownDirective)(directive) : {};
    return {
        onCreate: args.onCreate ?? defaultArguments.onCreate,
        onUpdate: args.onUpdate ?? defaultArguments.onUpdate,
    };
}
function parseFilterableDirective(directive) {
    const defaultArguments = {
        byValue: true,
        byAggregate: directive === undefined ? true : false,
    };
    const args = directive ? (0, parse_arguments_1.parseArgumentsFromUnknownDirective)(directive) : {};
    return {
        byValue: args.byValue ?? defaultArguments.byValue,
        byAggregate: args.byAggregate ?? defaultArguments.byAggregate,
    };
}
//# sourceMappingURL=get-obj-field-meta.js.map