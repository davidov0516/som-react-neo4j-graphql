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
exports.collectUnionSubqueriesResults = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const add_sort_and_limit_to_clause_1 = require("./add-sort-and-limit-to-clause");
function collectUnionSubqueriesResults({ resultVariable, optionsInput, isArray, }) {
    const withSortClause = createWithSortAndPaginationClauses(resultVariable, optionsInput);
    let returnProjection = cypher_builder_1.default.collect(resultVariable);
    if (!isArray) {
        returnProjection = cypher_builder_1.default.head(returnProjection);
    }
    const returnClause = new cypher_builder_1.default.Return([returnProjection, resultVariable]);
    return cypher_builder_1.default.concat(withSortClause, returnClause);
}
exports.collectUnionSubqueriesResults = collectUnionSubqueriesResults;
function createWithSortAndPaginationClauses(variable, optionsInput) {
    const withSortClause = new cypher_builder_1.default.With(variable);
    (0, add_sort_and_limit_to_clause_1.addSortAndLimitOptionsToClause)({
        optionsInput,
        target: variable,
        projectionClause: withSortClause,
    });
    return withSortClause;
}
//# sourceMappingURL=collect-union-subqueries-results.js.map