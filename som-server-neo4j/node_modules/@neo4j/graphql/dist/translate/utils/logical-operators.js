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
exports.isLogicalOperator = exports.getLogicalPredicate = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const constants_1 = require("../../constants");
function getLogicalPredicate(graphQLOperator, predicates) {
    if (predicates.length === 0)
        return undefined;
    if (graphQLOperator === "NOT") {
        const notPredicate = predicates[0];
        return notPredicate ? cypher_builder_1.default.not(notPredicate) : undefined;
    }
    else if (graphQLOperator === "AND") {
        return cypher_builder_1.default.and(...predicates);
    }
    else if (graphQLOperator === "OR") {
        return cypher_builder_1.default.or(...predicates);
    }
}
exports.getLogicalPredicate = getLogicalPredicate;
function isLogicalOperator(key) {
    return constants_1.LOGICAL_OPERATORS.includes(key);
}
exports.isLogicalOperator = isLogicalOperator;
//# sourceMappingURL=logical-operators.js.map