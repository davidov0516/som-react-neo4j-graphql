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
exports.ValidRelationshipProperties = void 0;
const graphql_1 = require("graphql");
const constants_1 = require("../../../../constants");
const document_validation_error_1 = require("../utils/document-validation-error");
const path_parser_1 = require("../utils/path-parser");
function ValidRelationshipProperties(context) {
    const relationshipPropertyTypeNames = new Set();
    const doOnInterface = {
        leave(node, _key, _parent, path, ancestors) {
            if (relationshipPropertyTypeNames.has(node.name.value)) {
                const { isValid, errorMsg, errorPath } = (0, document_validation_error_1.assertValid)(() => assertRelationshipProperties(node));
                const [pathToNode] = (0, path_parser_1.getPathToNode)(path, ancestors);
                if (!isValid) {
                    context.reportError((0, document_validation_error_1.createGraphQLError)({
                        nodes: [node],
                        path: [...pathToNode, node.name.value, ...errorPath],
                        errorMsg,
                    }));
                }
            }
        },
    };
    return {
        Directive(directiveNode, _key, _parent, path, ancestors) {
            const [pathToNode, traversedDef] = (0, path_parser_1.getPathToNode)(path, ancestors);
            if (!traversedDef) {
                console.error("No last definition traversed");
                return;
            }
            if (directiveNode.name.value === "relationshipProperties") {
                const { isValid, errorMsg, errorPath } = (0, document_validation_error_1.assertValid)(() => assertRelationshipProperties(traversedDef));
                if (!isValid) {
                    context.reportError((0, document_validation_error_1.createGraphQLError)({
                        nodes: [directiveNode, traversedDef],
                        path: [...pathToNode, ...errorPath],
                        errorMsg,
                    }));
                }
                else {
                    // to check on extensions
                    relationshipPropertyTypeNames.add(traversedDef?.name.value);
                }
            }
        },
        InterfaceTypeDefinition: doOnInterface,
        InterfaceTypeExtension: doOnInterface,
    };
}
exports.ValidRelationshipProperties = ValidRelationshipProperties;
function assertRelationshipProperties(traversedDef) {
    if (traversedDef.kind !== graphql_1.Kind.INTERFACE_TYPE_DEFINITION && traversedDef.kind !== graphql_1.Kind.INTERFACE_TYPE_EXTENSION) {
        // delegate
        return;
    }
    traversedDef.fields?.forEach((field) => {
        const errorPath = [field.name.value];
        constants_1.RESERVED_INTERFACE_FIELDS.forEach(([fieldName, message]) => {
            if (field.name.value === fieldName) {
                throw new document_validation_error_1.DocumentValidationError(`Invalid @relationshipProperties field: ${message}`, errorPath);
            }
        });
        if (field.directives) {
            const forbiddenDirectives = [
                "authorization",
                "authentication",
                "subscriptionsAuthorization",
                "relationship",
                "cypher",
            ];
            const foundForbiddenDirective = field.directives.find((d) => forbiddenDirectives.includes(d.name.value));
            if (foundForbiddenDirective) {
                throw new document_validation_error_1.DocumentValidationError(`Invalid @relationshipProperties field: Cannot use the @${foundForbiddenDirective.name.value} directive on relationship properties.`, errorPath);
            }
        }
    });
}
//# sourceMappingURL=valid-relationship-properties.js.map