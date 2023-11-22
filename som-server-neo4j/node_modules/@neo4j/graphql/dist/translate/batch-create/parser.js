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
exports.parseCreate = exports.mergeTreeDescriptors = exports.getTreeDescriptor = exports.inputTreeToCypherMap = void 0;
const types_1 = require("./types");
const classes_1 = require("../../classes");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const GraphQLInputAST_1 = require("./GraphQLInputAST/GraphQLInputAST");
const map_to_db_property_1 = __importDefault(require("../../utils/map-to-db-property"));
function getRelationshipFields(node, key, context) {
    const relationField = node.relationFields.find((x) => key === x.fieldName);
    const refNodes = [];
    if (relationField) {
        if (relationField.interface || relationField.union) {
            throw new types_1.UnsupportedUnwindOptimization(`Not supported operation: Interface or Union`);
        }
        else {
            refNodes.push(context.nodes.find((x) => x.name === relationField.typeMeta.name));
        }
    }
    return [relationField, refNodes];
}
function inputTreeToCypherMap(input, node, context, parentKey, relationship) {
    if (Array.isArray(input)) {
        return new cypher_builder_1.default.List(input.map((GraphQLCreateInput) => inputTreeToCypherMap(GraphQLCreateInput, node, context, parentKey, relationship)));
    }
    const properties = Object.entries(input).reduce((obj, [key, value]) => {
        const [relationField, relatedNodes] = getRelationshipFields(node, key, context);
        if (relationField && relationField.properties) {
            relationship = context.relationships.find((x) => x.properties === relationField.properties);
        }
        let scalarOrEnum = false;
        if (parentKey === "edge") {
            scalarOrEnum = isScalarOrEnum(key, relationship);
        }
        // it assume that if parentKey is not defined then it means that the key belong to a Node
        else if (parentKey === "node" || parentKey === undefined) {
            scalarOrEnum = isScalarOrEnum(key, node);
        }
        if (typeof value === "object" && value !== null && (relationField || !scalarOrEnum)) {
            if (Array.isArray(value)) {
                obj[key] = new cypher_builder_1.default.List(value.map((GraphQLCreateInput) => inputTreeToCypherMap(GraphQLCreateInput, relationField ? relatedNodes[0] : node, context, key, relationship)));
                return obj;
            }
            obj[key] = inputTreeToCypherMap(value, relationField ? relatedNodes[0] : node, context, key, relationship);
            return obj;
        }
        obj[key] = new cypher_builder_1.default.Param(value);
        return obj;
    }, {});
    return new cypher_builder_1.default.Map(properties);
}
exports.inputTreeToCypherMap = inputTreeToCypherMap;
function isScalarOrEnum(fieldName, graphElement) {
    const scalarOrEnumPredicate = (x) => x.fieldName === fieldName;
    const scalarOrEnumFields = [
        graphElement.primitiveFields,
        graphElement.temporalFields,
        graphElement.pointFields,
        graphElement.scalarFields,
        graphElement.enumFields,
    ];
    return scalarOrEnumFields.flat().some(scalarOrEnumPredicate);
}
function getTreeDescriptor(input, node, context, parentKey, relationship) {
    return Object.entries(input).reduce((previous, [key, value]) => {
        const [relationField, relatedNodes] = getRelationshipFields(node, key, context);
        if (relationField && relationField.properties) {
            relationship = context.relationships.find((x) => x.properties === relationField.properties);
        }
        let scalarOrEnum = false;
        if (parentKey === "edge") {
            scalarOrEnum = isScalarOrEnum(key, relationship);
        }
        // it assume that if parentKey is not defined then it means that the key belong to a Node
        else if (parentKey === "node" || parentKey === undefined) {
            scalarOrEnum = isScalarOrEnum(key, node);
        }
        if (typeof value === "object" && value !== null && !scalarOrEnum) {
            // TODO: supports union/interfaces
            const innerNode = relationField && relatedNodes[0] ? relatedNodes[0] : node;
            if (Array.isArray(value)) {
                previous.children[key] = mergeTreeDescriptors(value.map((el) => getTreeDescriptor(el, innerNode, context, key, relationship)));
                return previous;
            }
            previous.children[key] = getTreeDescriptor(value, innerNode, context, key, relationship);
            return previous;
        }
        previous.properties.add(key);
        return previous;
    }, { properties: new Set(), children: {} });
}
exports.getTreeDescriptor = getTreeDescriptor;
function mergeTreeDescriptors(input) {
    return input.reduce((previous, node) => {
        previous.properties = new Set([...previous.properties, ...node.properties]);
        const entries = [...new Set([...Object.keys(previous.children), ...Object.keys(node.children)])].map((childrenKey) => {
            const previousChildren = previous.children[childrenKey] ?? { properties: new Set(), children: {} };
            const nodeChildren = node.children[childrenKey] ?? { properties: new Set(), children: {} };
            return [childrenKey, mergeTreeDescriptors([previousChildren, nodeChildren])];
        });
        previous.children = Object.fromEntries(entries);
        return previous;
    }, { properties: new Set(), children: {} });
}
exports.mergeTreeDescriptors = mergeTreeDescriptors;
function parser(input, node, context, parentASTNode) {
    Object.entries(input.children).forEach(([key, value]) => {
        const [relationField, relatedNodes] = getRelationshipFields(node, key, context);
        if (relationField) {
            let edge;
            if (relationField.properties) {
                edge = context.relationships.find((x) => x.properties === relationField.properties);
            }
            if (relationField.interface || relationField.union) {
                throw new types_1.UnsupportedUnwindOptimization(`Not supported operation: Interface or Union`);
            }
            Object.entries(value.children).forEach(([operation, description]) => {
                switch (operation) {
                    case "create":
                        parentASTNode.addChildren(parseNestedCreate(description, relatedNodes[0], context, node, key, [relationField, relatedNodes], edge));
                        break;
                    /*
                    case "connect":
                         parentASTNode.addChildren(
                            parseConnect(description, relatedNodes[0], context, node, key, [
                                relationField,
                                relatedNodes,
                            ])
                        );
                        break;
                    case "connectOrCreate":
                         parentASTNode.addChildren(parseConnectOrCreate(description, relatedNodes[0], context, node));
                        break;
                    */
                    default:
                        throw new types_1.UnsupportedUnwindOptimization(`Not supported operation: ${operation}`);
                }
            });
        }
    });
    return parentASTNode;
}
function raiseAttributeAmbiguity(properties, graphElement) {
    const hash = {};
    properties.forEach((property) => {
        const dbName = (0, map_to_db_property_1.default)(graphElement, property);
        if (hash[dbName]) {
            throw new classes_1.Neo4jGraphQLError(`Conflicting modification of ${[hash[dbName], property].map((n) => `[[${n}]]`).join(", ")} on type ${graphElement.name}`);
        }
        hash[dbName] = property;
    });
}
function raiseOnNotSupportedProperty(graphElement) {
    graphElement.primitiveFields.forEach((property) => {
        if (property.callback && property.callback.operations.includes("CREATE")) {
            throw new types_1.UnsupportedUnwindOptimization("Not supported operation: Callback");
        }
    });
}
function parseCreate(input, node, context) {
    const nodeProperties = input.properties;
    raiseOnNotSupportedProperty(node);
    raiseAttributeAmbiguity(input.properties, node);
    const createAST = new GraphQLInputAST_1.CreateAST([...nodeProperties], node);
    parser(input, node, context, createAST);
    return createAST;
}
exports.parseCreate = parseCreate;
function parseNestedCreate(input, node, context, parentNode, relationshipPropertyPath, relationship, edge) {
    const nodeProperties = input.children.node.properties;
    const edgeProperties = input.children.edge ? input.children.edge.properties : [];
    raiseOnNotSupportedProperty(node);
    raiseAttributeAmbiguity(nodeProperties, node);
    if (edge) {
        raiseOnNotSupportedProperty(edge);
        raiseAttributeAmbiguity(edgeProperties, edge);
    }
    const nestedCreateAST = new GraphQLInputAST_1.NestedCreateAST(node, parentNode, [...nodeProperties], [...edgeProperties], relationshipPropertyPath, relationship, edge);
    if (input.children.node) {
        parser(input.children.node, node, context, nestedCreateAST);
    }
    return nestedCreateAST;
}
//# sourceMappingURL=parser.js.map