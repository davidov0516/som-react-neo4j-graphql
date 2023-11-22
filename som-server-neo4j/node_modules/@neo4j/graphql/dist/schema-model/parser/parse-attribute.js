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
exports.parseAttribute = exports.parseAttributeArguments = void 0;
const graphql_1 = require("graphql");
const directives_1 = require("../../graphql/directives");
const CustomResolverAnnotation_1 = require("../annotation/CustomResolverAnnotation");
const Argument_1 = require("../argument/Argument");
const Attribute_1 = require("../attribute/Attribute");
const AttributeType_1 = require("../attribute/AttributeType");
const parse_annotation_1 = require("./parse-annotation");
const parse_arguments_1 = require("./parse-arguments");
const utils_1 = require("./utils");
function parseAttributeArguments(fieldArgs, definitionCollection) {
    return fieldArgs.map((fieldArg) => {
        return new Argument_1.Argument({
            name: fieldArg.name.value,
            type: parseTypeNode(definitionCollection, fieldArg.type),
            defaultValue: fieldArg.defaultValue,
            description: fieldArg.description?.value,
        });
    });
}
exports.parseAttributeArguments = parseAttributeArguments;
function parseAttribute(field, inheritedField, definitionCollection, definitionFields) {
    const name = field.name.value;
    const type = parseTypeNode(definitionCollection, field.type);
    const args = parseAttributeArguments(field.arguments || [], definitionCollection);
    const inheritedDirectives = inheritedField?.flatMap((f) => f.directives || []) || [];
    const annotations = (0, parse_annotation_1.parseAnnotations)((field.directives || []).concat(inheritedDirectives));
    for (const annotation of annotations) {
        if (annotation instanceof CustomResolverAnnotation_1.CustomResolverAnnotation) {
            annotation.parseRequire(definitionCollection.document, definitionFields);
        }
    }
    const databaseName = getDatabaseName(field, inheritedField);
    return new Attribute_1.Attribute({
        name,
        annotations,
        type,
        args,
        databaseName,
        description: field.description?.value,
    });
}
exports.parseAttribute = parseAttribute;
function getDatabaseName(fieldDefinitionNode, inheritedFields) {
    const aliasUsage = (0, utils_1.findDirective)(fieldDefinitionNode.directives, directives_1.aliasDirective.name);
    if (aliasUsage) {
        const { property } = (0, parse_arguments_1.parseArguments)(directives_1.aliasDirective, aliasUsage);
        return property;
    }
    const inheritedAliasUsage = inheritedFields?.reduce((aliasUsage, field) => {
        // TODO: takes the first one
        // multiple interfaces can have this annotation - must constrain this flexibility by design
        if (!aliasUsage) {
            aliasUsage = (0, utils_1.findDirective)(field.directives, directives_1.aliasDirective.name);
        }
        return aliasUsage;
    }, undefined);
    if (inheritedAliasUsage) {
        const { property } = (0, parse_arguments_1.parseArguments)(directives_1.aliasDirective, inheritedAliasUsage);
        return property;
    }
}
function parseTypeNode(definitionCollection, typeNode, isRequired = false) {
    switch (typeNode.kind) {
        case graphql_1.Kind.NAMED_TYPE: {
            if (isScalarType(typeNode.name.value)) {
                return new AttributeType_1.ScalarType(typeNode.name.value, isRequired);
            }
            else if (isPoint(typeNode.name.value)) {
                return new AttributeType_1.Neo4jPointType(isRequired);
            }
            else if (isCartesianPoint(typeNode.name.value)) {
                return new AttributeType_1.Neo4jCartesianPointType(isRequired);
            }
            else if (isEnum(definitionCollection, typeNode.name.value)) {
                return new AttributeType_1.EnumType(typeNode.name.value, isRequired);
            }
            else if (isUserScalar(definitionCollection, typeNode.name.value)) {
                return new AttributeType_1.UserScalarType(typeNode.name.value, isRequired);
            }
            else if (isObject(definitionCollection, typeNode.name.value)) {
                return new AttributeType_1.ObjectType(typeNode.name.value, isRequired);
            }
            else if (isUnion(definitionCollection, typeNode.name.value)) {
                return new AttributeType_1.UnionType(typeNode.name.value, isRequired);
            }
            else if (isInterface(definitionCollection, typeNode.name.value)) {
                return new AttributeType_1.InterfaceType(typeNode.name.value, isRequired);
            }
            else if (isInput(definitionCollection, typeNode.name.value)) {
                return new AttributeType_1.InputType(typeNode.name.value, isRequired);
            }
            else {
                return new AttributeType_1.UnknownType(typeNode.name.value, isRequired);
            }
        }
        case graphql_1.Kind.LIST_TYPE: {
            const innerType = parseTypeNode(definitionCollection, typeNode.type);
            return new AttributeType_1.ListType(innerType, isRequired);
        }
        case graphql_1.Kind.NON_NULL_TYPE:
            return parseTypeNode(definitionCollection, typeNode.type, true);
    }
}
function isInterface(definitionCollection, name) {
    return definitionCollection.interfaceTypes.has(name);
}
function isUnion(definitionCollection, name) {
    return definitionCollection.unionTypes.has(name);
}
function isEnum(definitionCollection, name) {
    return definitionCollection.enumTypes.has(name);
}
function isUserScalar(definitionCollection, name) {
    return definitionCollection.scalarTypes.has(name);
}
function isObject(definitionCollection, name) {
    return definitionCollection.nodes.has(name);
}
function isInput(definitionCollection, name) {
    return definitionCollection.inputTypes.has(name);
}
function isPoint(value) {
    return isNeo4jGraphQLSpatialType(value) && value === AttributeType_1.Neo4jGraphQLSpatialType.Point;
}
function isCartesianPoint(value) {
    return isNeo4jGraphQLSpatialType(value) && value === AttributeType_1.Neo4jGraphQLSpatialType.CartesianPoint;
}
function isNeo4jGraphQLSpatialType(value) {
    return Object.values(AttributeType_1.Neo4jGraphQLSpatialType).includes(value);
}
function isScalarType(value) {
    return isGraphQLBuiltInScalar(value) || isNeo4jGraphQLNumberType(value) || isNeo4jGraphQLTemporalType(value);
}
function isGraphQLBuiltInScalar(value) {
    return Object.values(AttributeType_1.GraphQLBuiltInScalarType).includes(value);
}
function isNeo4jGraphQLNumberType(value) {
    return Object.values(AttributeType_1.Neo4jGraphQLNumberType).includes(value);
}
function isNeo4jGraphQLTemporalType(value) {
    return Object.values(AttributeType_1.Neo4jGraphQLTemporalType).includes(value);
}
//# sourceMappingURL=parse-attribute.js.map