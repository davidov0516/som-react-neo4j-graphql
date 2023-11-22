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
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_connection_operation_1 = require("./property-operations/create-connection-operation");
const compile_cypher_1 = require("../../utils/compile-cypher");
function createConnectionWhereAndParams({ whereInput, context, node, nodeVariable, relationship, relationshipVariable, parameterPrefix, }) {
    const nodeRef = new cypher_builder_1.default.NamedNode(nodeVariable);
    const edgeRef = new cypher_builder_1.default.NamedVariable(relationshipVariable);
    const { predicate: andOp, preComputedSubqueries } = (0, create_connection_operation_1.createConnectionWherePropertyOperation)({
        context,
        whereInput,
        edgeRef,
        targetNode: nodeRef,
        node,
        edge: relationship,
    });
    let subquery = "";
    const whereCypher = new cypher_builder_1.default.RawCypher((env) => {
        const cypher = andOp?.getCypher(env) || "";
        if (preComputedSubqueries) {
            subquery = (0, compile_cypher_1.compileCypher)(preComputedSubqueries, env);
        }
        return [cypher, {}];
    });
    // NOTE: the following prefix is just to avoid collision until this is refactored into a single cypher ast
    const result = whereCypher.build(`${parameterPrefix.replace(/\./g, "_").replace(/\[|\]/g, "")}_${nodeVariable}`);
    return { cypher: result.cypher, subquery, params: result.params };
}
exports.default = createConnectionWhereAndParams;
//# sourceMappingURL=create-connection-where-and-params.js.map