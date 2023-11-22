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
const create_where_predicate_1 = require("./create-where-predicate");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const compile_cypher_1 = require("../../utils/compile-cypher");
// TODO: Remove this method and replace for directly using createWherePredicate
/** Wraps createCypherWhereParams with the old interface for compatibility with old way of composing cypher */
function createWhereAndParams({ whereInput, varName, chainStr, node, context, recursing, }) {
    const nodeRef = new cypher_builder_1.default.NamedNode(varName);
    const { predicate: wherePredicate, preComputedSubqueries } = (0, create_where_predicate_1.createWherePredicate)({
        element: node,
        context,
        whereInput,
        targetElement: nodeRef,
    });
    let preComputedWhereFieldsResult = "";
    const whereCypher = new cypher_builder_1.default.RawCypher((env) => {
        preComputedWhereFieldsResult = (0, compile_cypher_1.compileCypherIfExists)(preComputedSubqueries, env);
        const cypher = wherePredicate?.getCypher(env) || "";
        return [cypher, {}];
    });
    const result = whereCypher.build(`${chainStr || ""}${varName}_`);
    const whereStr = `${!recursing ? "WHERE " : ""}`;
    return [`${whereStr}${result.cypher}`, preComputedWhereFieldsResult, result.params];
}
exports.default = createWhereAndParams;
//# sourceMappingURL=create-where-and-params.js.map