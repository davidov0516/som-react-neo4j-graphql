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
const graphql_1 = require("graphql");
function getUniqueMeta(directives, type, fieldName) {
    const uniqueDirective = directives.find((x) => x.name.value === "unique");
    if (uniqueDirective && type.kind === graphql_1.Kind.INTERFACE_TYPE_DEFINITION) {
        throw new Error(`@unique directive cannot be used on interface type fields: ${type.name.value}.${fieldName}`);
    }
    if (uniqueDirective) {
        const constraintName = uniqueDirective.arguments?.find((a) => a.name.value === "constraintName");
        if (constraintName && constraintName.value.kind === graphql_1.Kind.STRING) {
            return { constraintName: constraintName.value.value };
        }
        return { constraintName: `${type.name.value}_${fieldName}` };
    }
    if (directives.some((directive) => directive.name.value === "relayId")) {
        return { constraintName: `${type.name.value}_${fieldName}` };
    }
}
exports.default = getUniqueMeta;
//# sourceMappingURL=get-unique-meta.js.map