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
exports.createAuthorizationBeforeAndParams = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_authorization_before_predicate_1 = require("../create-authorization-before-predicate");
const compile_predicate_return_1 = require("./compile-predicate-return");
function stringNodeMapToNodeMap(stringNodeMap) {
    return stringNodeMap.map((nodeMap) => {
        return {
            ...nodeMap,
            variable: new cypher_builder_1.default.NamedNode(nodeMap.variable),
        };
    });
}
function createAuthorizationBeforeAndParams({ context, nodes, operations, }) {
    const nodeMap = stringNodeMapToNodeMap(nodes);
    const predicateReturn = (0, create_authorization_before_predicate_1.createAuthorizationBeforePredicate)({
        context,
        nodes: nodeMap,
        operations,
    });
    if (predicateReturn) {
        return (0, compile_predicate_return_1.compilePredicateReturn)(predicateReturn);
    }
    return undefined;
}
exports.createAuthorizationBeforeAndParams = createAuthorizationBeforeAndParams;
//# sourceMappingURL=create-authorization-before-and-params.js.map