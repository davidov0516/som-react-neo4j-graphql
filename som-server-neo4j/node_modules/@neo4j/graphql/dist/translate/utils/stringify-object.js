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
exports.stringifyObject = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
/** Serializes object into a string for Cypher objects */
function stringifyObject(fields) {
    return new cypher_builder_1.default.RawCypher((env) => `{ ${Object.entries(fields)
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => {
        if (value instanceof cypher_builder_1.default.RawCypher) {
            return `${key}: ${value?.getCypher(env)}`;
        }
        else {
            return `${key}: ${value}`;
        }
    })
        .join(", ")} }`);
}
exports.stringifyObject = stringifyObject;
//# sourceMappingURL=stringify-object.js.map