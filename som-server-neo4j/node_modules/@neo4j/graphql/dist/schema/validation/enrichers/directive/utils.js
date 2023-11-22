"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirectiveDefinition = exports.containsDirective = void 0;
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
const graphql_1 = require("graphql");
function containsDirective(object, directiveName) {
    switch (object.kind) {
        case graphql_1.Kind.INTERFACE_TYPE_EXTENSION:
        case graphql_1.Kind.OBJECT_TYPE_EXTENSION:
        case graphql_1.Kind.INTERFACE_TYPE_DEFINITION:
        case graphql_1.Kind.OBJECT_TYPE_DEFINITION: {
            return !!(getDirectiveDefinition(object, directiveName) ||
                (!!object.fields && object.fields.some((field) => getDirectiveDefinition(field, directiveName))));
        }
        default:
            return false;
    }
}
exports.containsDirective = containsDirective;
function getDirectiveDefinition(typeDefinitionNode, directiveName) {
    return typeDefinitionNode.directives?.find((directive) => directive.name.value === directiveName);
}
exports.getDirectiveDefinition = getDirectiveDefinition;
//# sourceMappingURL=utils.js.map