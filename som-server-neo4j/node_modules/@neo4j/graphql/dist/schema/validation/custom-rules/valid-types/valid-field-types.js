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
exports.ValidFieldTypes = void 0;
const id_1 = require("../directives/id");
const relationship_1 = require("../directives/relationship");
const timestamp_1 = require("../directives/timestamp");
const unique_1 = require("../directives/unique");
const document_validation_error_1 = require("../utils/document-validation-error");
const path_parser_1 = require("../utils/path-parser");
function getValidationFunction(directiveName) {
    switch (directiveName) {
        case "id":
            return id_1.verifyId;
        case "timestamp":
            return timestamp_1.verifyTimestamp;
        case "unique":
            return unique_1.verifyUnique;
        case "relationship":
            return relationship_1.verifyRelationshipFieldType;
        default:
            return;
    }
}
function ValidFieldTypes(context) {
    return {
        Directive(directiveNode, _key, _parent, path, ancestors) {
            const [pathToNode, traversedDef, parentOfTraversedDef] = (0, path_parser_1.getPathToNode)(path, ancestors);
            const validationFn = getValidationFunction(directiveNode.name.value);
            if (!validationFn) {
                return;
            }
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
                    nodes: [traversedDef],
                    path: [...pathToNode, ...errorPath],
                    errorMsg,
                }));
            }
        },
    };
}
exports.ValidFieldTypes = ValidFieldTypes;
//# sourceMappingURL=valid-field-types.js.map