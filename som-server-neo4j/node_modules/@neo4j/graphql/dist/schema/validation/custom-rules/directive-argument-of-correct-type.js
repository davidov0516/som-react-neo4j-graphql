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
exports.DirectiveArgumentOfCorrectType = void 0;
const graphql_1 = require("graphql");
const validation_error_codes_1 = require("../utils/validation-error-codes");
const document_validation_error_1 = require("./utils/document-validation-error");
const path_parser_1 = require("./utils/path-parser");
function DirectiveArgumentOfCorrectType(includeAuthorizationDirectives = true) {
    return function (context) {
        // TODO: find a way to scope this schema instead of creating the whole document
        // should only contain dynamic directives and their associated types (typeWhere + jwt payload)
        let schema;
        const getSchemaFromDocument = () => {
            if (!schema) {
                schema = (0, graphql_1.buildASTSchema)(context.getDocument(), { assumeValid: true, assumeValidSDL: true });
            }
            return schema;
        };
        return {
            Directive(directiveNode, _key, _parent, path, ancenstors) {
                const oneOfAuthorizationDirectives = includeAuthorizationDirectives &&
                    ["subscriptionsAuthorization", "authorization", "authentication"].reduce((genericDirective, oneOfAuthorizationDirectives) => {
                        if (!genericDirective &&
                            directiveNode.name.value
                                .toLowerCase()
                                .includes(oneOfAuthorizationDirectives.toLowerCase())) {
                            genericDirective = oneOfAuthorizationDirectives;
                        }
                        return genericDirective;
                    }, undefined);
                const otherDirectives = ["fulltext", "relationship", "node", "customResolver", "cypher"].find((applicableDirectiveName) => directiveNode.name.value.toLowerCase() === applicableDirectiveName.toLowerCase());
                if (!oneOfAuthorizationDirectives && !otherDirectives) {
                    return;
                }
                let directiveName;
                let directiveDefinition;
                if (oneOfAuthorizationDirectives) {
                    directiveDefinition = getSchemaFromDocument().getDirective(directiveNode.name.value);
                    directiveName = oneOfAuthorizationDirectives;
                }
                else {
                    directiveDefinition = context.getSchema()?.getDirective(directiveNode.name.value);
                    directiveName = directiveNode.name.value;
                }
                if (!directiveDefinition) {
                    // Do not report, delegate this report to KnownDirectivesRule
                    return;
                }
                const pathToHere = [...(0, path_parser_1.getPathToNode)(path, ancenstors)[0], `@${directiveName}`];
                for (const argument of directiveNode.arguments || []) {
                    const argumentDefinition = findArgumentDefinitionNodeByName(directiveDefinition.args, argument.name.value);
                    if (!argumentDefinition) {
                        return;
                    }
                    const { isValid, errorMsg, errorPath } = assertArgumentType(argument, argumentDefinition);
                    if (!isValid) {
                        context.reportError((0, document_validation_error_1.createGraphQLError)({
                            nodes: [argument, directiveNode],
                            path: [...pathToHere, argument.name.value, ...errorPath],
                            errorMsg: `Invalid argument: ${argument.name.value}, error: ${errorMsg}`,
                            extensions: {
                                exception: { code: validation_error_codes_1.VALIDATION_ERROR_CODES[directiveName.toUpperCase()] },
                            },
                        }));
                    }
                }
            },
        };
    };
}
exports.DirectiveArgumentOfCorrectType = DirectiveArgumentOfCorrectType;
function findArgumentDefinitionNodeByName(args, name) {
    return args.find((arg) => arg.name === name);
}
function assertArgumentType(argumentNode, inputValueDefinition) {
    const argType = inputValueDefinition.type;
    const argValue = (0, graphql_1.valueFromASTUntyped)(argumentNode.value);
    let isValid = true;
    let errorMsg = "";
    let errorPath = [];
    (0, graphql_1.coerceInputValue)(argValue, argType, (path, _invalidValue, error) => {
        isValid = false;
        errorMsg = error.message;
        errorPath = path;
    });
    return { isValid, errorMsg, errorPath };
}
//# sourceMappingURL=directive-argument-of-correct-type.js.map