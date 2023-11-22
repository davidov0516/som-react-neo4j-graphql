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
exports.createProjectionSubquery = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_where_predicate_1 = require("../../where/create-where-predicate");
const add_sort_and_limit_to_clause_1 = require("./add-sort-and-limit-to-clause");
const create_authorization_before_predicate_1 = require("../../authorization/create-authorization-before-predicate");
const compile_cypher_1 = require("../../../utils/compile-cypher");
function createProjectionSubquery({ parentNode, whereInput, node, context, subqueryReturnAlias, nestedProjection, nestedSubqueries, targetNode, relationField, relationshipDirection, optionsInput, nestedPredicates = [], addSkipAndLimit = true, collect = true, }) {
    const isArray = relationField.typeMeta.array;
    const relationship = new cypher_builder_1.default.Relationship({
        type: relationField.type,
    });
    const pattern = new cypher_builder_1.default.Pattern(parentNode)
        .withoutLabels()
        .related(relationship)
        .withDirection(relationshipDirection)
        .to(targetNode);
    const subqueryMatch = new cypher_builder_1.default.Match(pattern);
    const predicates = nestedPredicates;
    const projection = new cypher_builder_1.default.RawCypher((env) => {
        // TODO: use MapProjection
        return `${(0, compile_cypher_1.compileCypher)(targetNode, env)} ${(0, compile_cypher_1.compileCypher)(nestedProjection, env)}`;
    });
    let preComputedWhereFieldSubqueries;
    if (whereInput) {
        const { predicate: wherePredicate, preComputedSubqueries } = (0, create_where_predicate_1.createWherePredicate)({
            element: node,
            context,
            whereInput,
            targetElement: targetNode,
        });
        if (wherePredicate)
            predicates.push(wherePredicate);
        preComputedWhereFieldSubqueries = preComputedSubqueries;
    }
    const authorizationPredicateReturn = (0, create_authorization_before_predicate_1.createAuthorizationBeforePredicate)({
        context,
        nodes: [
            {
                variable: targetNode,
                node,
            },
        ],
        operations: ["READ"],
    });
    if (authorizationPredicateReturn) {
        const { predicate: authorizationBeforePredicate, preComputedSubqueries: authorizationBeforeSubqueries } = authorizationPredicateReturn;
        if (authorizationBeforePredicate) {
            predicates.push(authorizationBeforePredicate);
        }
        if (authorizationBeforeSubqueries && !authorizationBeforeSubqueries.empty) {
            preComputedWhereFieldSubqueries = cypher_builder_1.default.concat(preComputedWhereFieldSubqueries, authorizationBeforeSubqueries);
        }
    }
    const withStatement = new cypher_builder_1.default.With([projection, targetNode]); // This only works if nestedProjection is a map
    if (addSkipAndLimit) {
        (0, add_sort_and_limit_to_clause_1.addSortAndLimitOptionsToClause)({
            optionsInput,
            target: targetNode,
            projectionClause: withStatement,
        });
    }
    let returnProjection = targetNode;
    if (collect) {
        returnProjection = cypher_builder_1.default.collect(targetNode);
        if (!isArray) {
            returnProjection = cypher_builder_1.default.head(returnProjection);
        }
    }
    const returnStatement = new cypher_builder_1.default.Return([returnProjection, subqueryReturnAlias]);
    if (preComputedWhereFieldSubqueries && !preComputedWhereFieldSubqueries.empty) {
        const preComputedSubqueryWith = new cypher_builder_1.default.With("*");
        preComputedSubqueryWith.where(cypher_builder_1.default.and(...predicates));
        return cypher_builder_1.default.concat(subqueryMatch, preComputedWhereFieldSubqueries, preComputedSubqueryWith, ...nestedSubqueries, withStatement, returnStatement);
    }
    subqueryMatch.where(cypher_builder_1.default.and(...predicates));
    return cypher_builder_1.default.concat(subqueryMatch, ...nestedSubqueries, withStatement, returnStatement);
}
exports.createProjectionSubquery = createProjectionSubquery;
//# sourceMappingURL=create-projection-subquery.js.map