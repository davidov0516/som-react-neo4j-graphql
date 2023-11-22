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
exports.createSortAndLimitProjection = void 0;
const graphql_relay_1 = require("graphql-relay");
const utils_1 = require("../../utils/utils");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const add_sort_and_limit_to_clause_1 = require("../projection/subquery/add-sort-and-limit-to-clause");
const get_sort_fields_1 = require("./get-sort-fields");
function createSortAndLimitProjection({ resolveTree, relationshipRef, nodeRef, limit, extraFields = [], ignoreSkipLimit = false, }) {
    const nodeAndEdgeSortFields = (0, get_sort_fields_1.getSortFields)(resolveTree);
    if (nodeAndEdgeSortFields.length === 0 && !limit) {
        return undefined;
    }
    const withStatement = new cypher_builder_1.default.With(relationshipRef, ...extraFields);
    let firstArg = resolveTree.args.first;
    const afterArg = resolveTree.args.after;
    let offset = (0, utils_1.isString)(afterArg) ? (0, graphql_relay_1.cursorToOffset)(afterArg) + 1 : undefined;
    if (limit) {
        const limitValue = (0, utils_1.isNeoInt)(limit) ? limit.toNumber() : limit;
        if (!firstArg || limitValue < (0, utils_1.toNumber)(firstArg)) {
            firstArg = limitValue;
        }
    }
    if (ignoreSkipLimit) {
        offset = undefined;
        firstArg = undefined;
    }
    nodeAndEdgeSortFields.forEach((sortField) => {
        const sortFieldEntries = Object.entries(sortField);
        const [nodeOrEdge, sortKeyAndValue] = sortFieldEntries[0];
        (0, add_sort_and_limit_to_clause_1.addSortAndLimitOptionsToClause)({
            optionsInput: { sort: [sortKeyAndValue], limit: firstArg, offset },
            target: nodeOrEdge === "node" ? nodeRef : relationshipRef,
            projectionClause: withStatement,
        });
    });
    if (limit) {
        // this limit is specified using `@limit` directive
        (0, add_sort_and_limit_to_clause_1.addLimitOrOffsetOptionsToClause)({
            optionsInput: { limit: firstArg, offset },
            projectionClause: withStatement,
        });
    }
    return withStatement;
}
exports.createSortAndLimitProjection = createSortAndLimitProjection;
//# sourceMappingURL=create-sort-and-limit.js.map