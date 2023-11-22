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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const relationship_1 = require("../graphql/directives/relationship");
const parse_arguments_1 = require("../schema-model/parser/parse-arguments");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
function getRelationshipMeta(field, interfaceField) {
    const directive = field.directives?.find((x) => x.name.value === "relationship") ||
        interfaceField?.directives?.find((x) => x.name.value === "relationship");
    if (!directive) {
        return undefined;
    }
    const relationshipMetaObject = getRelationshipDirectiveArguments(directive);
    const typeUnescaped = relationshipMetaObject.type;
    const type = cypher_builder_1.default.utils.escapeLabel(typeUnescaped);
    return {
        ...relationshipMetaObject,
        type,
        typeUnescaped,
    };
}
function getRelationshipDirectiveArguments(directiveNode) {
    return (0, parse_arguments_1.parseArguments)(relationship_1.relationshipDirective, directiveNode);
}
exports.default = getRelationshipMeta;
//# sourceMappingURL=get-relationship-meta.js.map