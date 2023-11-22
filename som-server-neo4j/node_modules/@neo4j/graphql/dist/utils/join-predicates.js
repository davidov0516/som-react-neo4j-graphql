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
exports.isPredicateJoin = exports.PREDICATE_JOINS = void 0;
exports.PREDICATE_JOINS = ["AND", "OR"];
function isPredicateJoin(value) {
    return ["AND", "OR"].includes(value);
}
exports.isPredicateJoin = isPredicateJoin;
function joinPredicates(predicates, joinType) {
    const filteredPredicates = predicates.filter(Boolean);
    if (filteredPredicates.length === 0) {
        return "";
    }
    if (filteredPredicates.length === 1) {
        return filteredPredicates[0];
    }
    return `(${joinType === "AND"
        ? filteredPredicates.join(" AND ")
        : filteredPredicates.map((predicate) => `(${predicate})`).join(" OR ")})`;
}
exports.default = joinPredicates;
//# sourceMappingURL=join-predicates.js.map