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
exports.ReservedTypeNames = void 0;
const graphql_1 = require("graphql");
const constants_1 = require("../../../../constants");
const document_validation_error_1 = require("../utils/document-validation-error");
function ReservedTypeNames(context) {
    return {
        enter(node) {
            if (!isReservableASTNode(node)) {
                return;
            }
            const { isValid, errorMsg } = (0, document_validation_error_1.assertValid)(() => assertTypeNameIsReserved(node));
            if (!isValid) {
                context.reportError((0, document_validation_error_1.createGraphQLError)({
                    nodes: [node],
                    errorMsg,
                }));
            }
        },
    };
}
exports.ReservedTypeNames = ReservedTypeNames;
function isReservableASTNode(node) {
    if ([
        graphql_1.Kind.OBJECT_TYPE_DEFINITION,
        graphql_1.Kind.SCALAR_TYPE_DEFINITION,
        graphql_1.Kind.INTERFACE_TYPE_DEFINITION,
        graphql_1.Kind.UNION_TYPE_DEFINITION,
        graphql_1.Kind.ENUM_TYPE_DEFINITION,
        graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION,
        graphql_1.Kind.INTERFACE_TYPE_EXTENSION,
    ].some((k) => k === node.kind)) {
        return true;
    }
    return false;
}
function assertTypeNameIsReserved(node) {
    constants_1.RESERVED_TYPE_NAMES.forEach((reservedName) => {
        if (reservedName.regex.test(node.name.value)) {
            throw new document_validation_error_1.DocumentValidationError(reservedName.error, []);
        }
    });
}
//# sourceMappingURL=reserved-type-names.js.map