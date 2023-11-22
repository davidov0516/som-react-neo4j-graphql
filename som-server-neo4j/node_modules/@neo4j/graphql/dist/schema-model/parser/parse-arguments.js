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
exports.parseArguments = exports.parseArgumentsFromUnknownDirective = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
const parse_value_node_1 = require("./parse-value-node");
function parseArgumentsFromUnknownDirective(directive) {
    return (directive.arguments || [])?.reduce((acc, argument) => {
        acc[argument.name.value] = (0, parse_value_node_1.parseValueNode)(argument.value);
        return acc;
    }, {});
}
exports.parseArgumentsFromUnknownDirective = parseArgumentsFromUnknownDirective;
/**
 * Polyfill of GraphQL-JS parseArguments, remove it after dropping the support of GraphQL-JS 15.0
 *
 * Prepares an object map of argument values given a list of argument
 * definitions and list of argument AST nodes.
 *
 * Note: The returned value is a plain Object with a prototype, since it is
 * exposed to user code. Care should be taken to not pull values from the
 * Object prototype.
 */
function parseArguments(def, node, variableValues) {
    const coercedValues = {};
    const argumentNodes = node.arguments ?? [];
    const argNodeMap = new Map(argumentNodes.map((arg) => [arg.name.value, arg]));
    for (const argDef of def.args) {
        const name = argDef.name;
        const argType = argDef.type;
        const argumentNode = argNodeMap.get(name);
        if (argumentNode == null) {
            if (argDef.defaultValue !== undefined) {
                coercedValues[name] = argDef.defaultValue;
            }
            else if ((0, graphql_1.isNonNullType)(argType)) {
                throw new Error(`Argument "${name}" of required type "${(0, utils_1.inspect)(argType)}" ` + "was not provided.");
            }
            continue;
        }
        const valueNode = argumentNode.value;
        let isNull = valueNode.kind === graphql_1.Kind.NULL;
        if (valueNode.kind === graphql_1.Kind.VARIABLE) {
            const variableName = valueNode.name.value;
            if (variableValues == null || !Object.prototype.hasOwnProperty.call(variableValues, variableName)) {
                if (argDef.defaultValue !== undefined) {
                    coercedValues[name] = argDef.defaultValue;
                }
                else if ((0, graphql_1.isNonNullType)(argType)) {
                    throw new Error(`Argument "${name}" of required type "${(0, utils_1.inspect)(argType)}" ` +
                        `was provided the variable "$${variableName}" which was not provided a runtime value.`);
                }
                continue;
            }
            isNull = variableValues[variableName] == null;
        }
        if (isNull && (0, graphql_1.isNonNullType)(argType)) {
            throw new Error(`Argument "${name}" of non-null type "${(0, utils_1.inspect)(argType)}" ` + "must not be null.");
        }
        const coercedValue = (0, graphql_1.valueFromAST)(valueNode, argType, variableValues);
        if (coercedValue === undefined) {
            throw new Error(`Argument "${name}" has invalid value ${(0, graphql_1.print)(valueNode)}.`);
        }
        coercedValues[name] = coercedValue;
    }
    return coercedValues;
}
exports.parseArguments = parseArguments;
//# sourceMappingURL=parse-arguments.js.map