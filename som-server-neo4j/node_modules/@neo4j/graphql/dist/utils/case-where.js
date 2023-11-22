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
exports.caseWhere = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
/**
 * caseWhere is a function that behaves like a WHERE filter appended after an OPTIONAL MATCH, it takes a predicate and a list of CypherVariable and returns a Clause.
 * If the predicate is true then it returns these variables, if the predicate is false then it returns a list of NULLs instead.
 * This is helpful when a Cypher block needs to be put between an OPTIONAL MATCH and a WHERE making the WHERE filter no longer optional.
 */
function caseWhere(predicate, columns) {
    const caseProjection = new cypher_builder_1.default.Variable();
    const nullList = new cypher_builder_1.default.List(Array(columns.length).fill(new cypher_builder_1.default.Literal(null)));
    const caseFilter = new cypher_builder_1.default.Case(predicate)
        .when(new cypher_builder_1.default.Literal(true))
        .then(new cypher_builder_1.default.List(columns))
        .else(nullList);
    const aggregationWith = new cypher_builder_1.default.With("*", [caseFilter, caseProjection]);
    const columnsProjection = Array(columns.length)
        .fill(() => undefined)
        .map((_, index) => [caseProjection.index(index), columns[index]]);
    const caseProjectionWith = new cypher_builder_1.default.With("*", ...columnsProjection);
    return cypher_builder_1.default.concat(aggregationWith, caseProjectionWith);
}
exports.caseWhere = caseWhere;
//# sourceMappingURL=case-where.js.map