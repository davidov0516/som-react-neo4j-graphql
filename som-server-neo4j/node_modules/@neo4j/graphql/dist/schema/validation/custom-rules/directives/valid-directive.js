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
exports.directiveIsValid = void 0;
const document_validation_error_1 = require("../utils/document-validation-error");
const path_parser_1 = require("../utils/path-parser");
const authorization_1 = require("./authorization");
const coalesce_1 = require("./coalesce");
const default_1 = require("./default");
const fulltext_1 = require("./fulltext");
const limit_1 = require("./limit");
const populatedBy_1 = require("./populatedBy");
const relationship_1 = require("./relationship");
function getValidationFunction(directiveName, objectTypeToFieldNameDirectionAndFieldTypePerRelationshipTypeMap, interfaceToImplementationsMap, extra, callbacks) {
    switch (directiveName) {
        case "coalesce":
            return (0, coalesce_1.verifyCoalesce)(extra.enums);
        case "default":
            return (0, default_1.verifyDefault)(extra.enums);
        case "fulltext":
            return fulltext_1.verifyFulltext;
        case "populatedBy":
            return (0, populatedBy_1.verifyPopulatedBy)(callbacks);
        case "limit":
            return limit_1.verifyLimit;
        case "relationship":
            return (0, relationship_1.verifyRelationshipArgumentValue)(objectTypeToFieldNameDirectionAndFieldTypePerRelationshipTypeMap, interfaceToImplementationsMap, extra);
        case "authorization":
            return (0, authorization_1.verifyAuthorization)();
        default:
            return;
    }
}
function extraDefinitionsProvided(extra) {
    if (!extra.enums || !extra.interfaces || !extra.unions || !extra.objects) {
        return false;
    }
    return true;
}
function directiveIsValid(extra, callbacks) {
    if (!extraDefinitionsProvided(extra)) {
        throw new Error("Missing data.");
    }
    return function (context) {
        const objectTypeToFieldNameDirectionAndFieldTypePerRelationshipTypeMap = new Map();
        const interfaceToImplementationsMap = new Map();
        return {
            Directive(directiveNode, _key, _parent, path, ancestors) {
                const validationFn = getValidationFunction(directiveNode.name.value, objectTypeToFieldNameDirectionAndFieldTypePerRelationshipTypeMap, interfaceToImplementationsMap, extra, callbacks);
                if (!validationFn) {
                    return;
                }
                const [pathToNode, traversedDef, parentOfTraversedDef] = (0, path_parser_1.getPathToNode)(path, ancestors);
                const pathToHere = [...pathToNode, `@${directiveNode.name.value}`];
                if (!traversedDef) {
                    console.error("No last definition traversed");
                    return;
                }
                const { isValid, errorMsg, errorPath } = (0, document_validation_error_1.assertValid)(() => validationFn({
                    directiveNode,
                    traversedDef,
                    parentDef: parentOfTraversedDef,
                }));
                if (!isValid) {
                    context.reportError((0, document_validation_error_1.createGraphQLError)({
                        nodes: [directiveNode, traversedDef],
                        path: [...pathToHere, ...errorPath],
                        errorMsg,
                    }));
                }
            },
        };
    };
}
exports.directiveIsValid = directiveIsValid;
//# sourceMappingURL=valid-directive.js.map