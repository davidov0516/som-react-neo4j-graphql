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
exports.ValidObjectType = void 0;
const document_validation_error_1 = require("../utils/document-validation-error");
function ValidObjectType(context) {
    return {
        ObjectTypeDefinition(objectType) {
            const { isValid, errorMsg } = (0, document_validation_error_1.assertValid)(() => assertValidType(objectType));
            if (!isValid) {
                context.reportError((0, document_validation_error_1.createGraphQLError)({
                    nodes: [objectType],
                    errorMsg,
                }));
            }
        },
        InterfaceTypeDefinition(interfaceType) {
            const { isValid, errorMsg } = (0, document_validation_error_1.assertValid)(() => assertValidType(interfaceType));
            if (!isValid) {
                context.reportError((0, document_validation_error_1.createGraphQLError)({
                    nodes: [interfaceType],
                    errorMsg,
                }));
            }
        },
    };
}
exports.ValidObjectType = ValidObjectType;
function assertValidType(type) {
    if (!type.fields || !type.fields.length) {
        throw new document_validation_error_1.DocumentValidationError("Objects and Interfaces must have one or more fields.", []);
    }
    const privateFieldsCount = type.fields.filter((f) => f.directives?.find((d) => d.name.value === "private")).length;
    const fieldsCount = type.fields.length;
    if (privateFieldsCount === fieldsCount) {
        throw new document_validation_error_1.DocumentValidationError("Objects and Interfaces must have one or more fields.", []);
    }
}
//# sourceMappingURL=valid-object-type.js.map