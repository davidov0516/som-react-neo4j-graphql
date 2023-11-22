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
exports.makeReplaceWildcardVisitor = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
const jwt_payload_1 = require("../../../graphql/directives/type-dependant-directives/jwt-payload");
function getDefaultValueForTypename(typeName) {
    switch (typeName) {
        case "Boolean":
            return false;
        case "String":
            return "";
        case "Int":
        case "Float":
            return 0;
        case "List":
            return [];
        default:
            return null;
    }
}
function makeReplacementFieldNode(fieldType) {
    let replacementValue = null;
    if (fieldType.kind === graphql_1.Kind.NAMED_TYPE) {
        replacementValue = getDefaultValueForTypename(fieldType.name.value);
    }
    if (fieldType.kind === graphql_1.Kind.LIST_TYPE) {
        replacementValue = getDefaultValueForTypename("List");
    }
    return (0, utils_1.astFromValueUntyped)(replacementValue);
}
function makeReplaceWildcardVisitor({ jwt, schema }) {
    return function replaceWildcardValue() {
        return {
            ObjectField: {
                leave(node) {
                    if (node.value.kind !== graphql_1.Kind.STRING) {
                        return;
                    }
                    const fieldValue = node.value.value;
                    if (!fieldValue.includes("$jwt")) {
                        return;
                    }
                    const jwtFieldName = fieldValue.substring(5);
                    const jwtField = jwt?.fields?.find((f) => f.name.value === jwtFieldName) ||
                        (0, jwt_payload_1.getStandardJwtDefinition)(schema)?.fields?.find((f) => f.name.value === jwtFieldName);
                    if (jwtField) {
                        const fieldWithReplacedValue = makeReplacementFieldNode(jwtField.type) || node.value;
                        return { ...node, value: fieldWithReplacedValue };
                    }
                },
            },
        };
    };
}
exports.makeReplaceWildcardVisitor = makeReplaceWildcardVisitor;
//# sourceMappingURL=replace-wildcard-value.js.map