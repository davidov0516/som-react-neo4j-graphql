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
exports.translateResolveReference = void 0;
const create_projection_and_params_1 = __importDefault(require("./create-projection-and-params"));
const translate_top_level_match_1 = require("./translate-top-level-match");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const compile_cypher_1 = require("../utils/compile-cypher");
function translateResolveReference({ node, context, reference, }) {
    const varName = "this";
    const { resolveTree } = context;
    const matchNode = new cypher_builder_1.default.NamedNode(varName, { labels: node.getLabels(context) });
    const { __typename, ...where } = reference;
    const { matchClause: topLevelMatch, preComputedWhereFieldSubqueries, whereClause: topLevelWhereClause, } = (0, translate_top_level_match_1.createMatchClause)({
        matchNode,
        node,
        context,
        operation: "READ",
        where,
    });
    const projection = (0, create_projection_and_params_1.default)({
        node,
        context,
        resolveTree,
        varName: matchNode,
        cypherFieldAliasMap: {},
    });
    let projAuth;
    const predicates = [];
    predicates.push(...projection.predicates);
    if (predicates.length) {
        projAuth = new cypher_builder_1.default.With("*").where(cypher_builder_1.default.and(...predicates));
    }
    const projectionSubqueries = cypher_builder_1.default.concat(...projection.subqueries, ...projection.subqueriesBeforeSort);
    const projectionExpression = new cypher_builder_1.default.RawCypher((env) => {
        return [`${varName} ${(0, compile_cypher_1.compileCypher)(projection.projection, env)}`, projection.params];
    });
    const returnClause = new cypher_builder_1.default.Return([projectionExpression, varName]);
    const preComputedWhereFields = preComputedWhereFieldSubqueries && !preComputedWhereFieldSubqueries.empty
        ? cypher_builder_1.default.concat(preComputedWhereFieldSubqueries, topLevelWhereClause)
        : topLevelWhereClause;
    const readQuery = cypher_builder_1.default.concat(topLevelMatch, preComputedWhereFields, projAuth, projectionSubqueries, returnClause);
    return readQuery.build();
}
exports.translateResolveReference = translateResolveReference;
//# sourceMappingURL=translate-resolve-reference.js.map