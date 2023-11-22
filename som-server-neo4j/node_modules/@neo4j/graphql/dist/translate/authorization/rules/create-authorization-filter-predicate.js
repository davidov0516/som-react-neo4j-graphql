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
exports.createAuthorizationFilterPredicate = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const get_or_create_cypher_variable_1 = require("../../utils/get-or-create-cypher-variable");
const create_authorization_where_predicate_1 = require("../where/create-authorization-where-predicate");
const find_matching_rules_1 = require("../utils/find-matching-rules");
function createAuthorizationFilterPredicate({ context, node, rules, variable, operations, }) {
    const cypherNode = (0, get_or_create_cypher_variable_1.getOrCreateCypherNode)(variable);
    const matchedRules = (0, find_matching_rules_1.findMatchingRules)(rules, operations);
    const predicates = [];
    let subqueries;
    matchedRules.forEach((rule) => {
        const { predicate, preComputedSubqueries } = (0, create_authorization_where_predicate_1.createAuthorizationWherePredicate)({
            where: rule.where,
            node,
            context,
            target: cypherNode,
        });
        if (predicate) {
            if (rule.requireAuthentication) {
                predicates.push(cypher_builder_1.default.and(cypher_builder_1.default.eq(context.authorization.isAuthenticatedParam, new cypher_builder_1.default.Literal(true)), predicate));
            }
            else {
                predicates.push(predicate);
            }
        }
        if (preComputedSubqueries && !preComputedSubqueries.empty) {
            subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
        }
    });
    return {
        predicate: cypher_builder_1.default.or(...predicates),
        preComputedSubqueries: subqueries,
    };
}
exports.createAuthorizationFilterPredicate = createAuthorizationFilterPredicate;
//# sourceMappingURL=create-authorization-filter-predicate.js.map