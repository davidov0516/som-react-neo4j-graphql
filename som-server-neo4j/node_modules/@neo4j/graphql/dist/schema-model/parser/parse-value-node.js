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
exports.parseValueNode = void 0;
const language_1 = require("graphql/language");
function parseValueNode(ast) {
    switch (ast.kind) {
        case language_1.Kind.ENUM:
        case language_1.Kind.STRING:
        case language_1.Kind.BOOLEAN:
            return ast.value;
        case language_1.Kind.INT:
        case language_1.Kind.FLOAT:
            return Number(ast.value);
        case language_1.Kind.NULL:
            return null;
        case language_1.Kind.LIST:
            return ast.values.map(parseValueNode);
        case language_1.Kind.OBJECT:
            return ast.fields.reduce((a, b) => {
                a[b.name.value] = parseValueNode(b.value);
                return a;
            }, {});
        default:
            throw new Error(`invalid Kind: ${ast.kind}`);
    }
}
exports.parseValueNode = parseValueNode;
//# sourceMappingURL=parse-value-node.js.map