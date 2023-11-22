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
exports.createMatchClause = exports.translateTopLevelMatch = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_where_predicate_1 = require("./where/create-where-predicate");
const fulltext_1 = require("../graphql/directives/fulltext");
const create_authorization_before_predicate_1 = require("./authorization/create-authorization-before-predicate");
function translateTopLevelMatch({ matchNode, node, context, operation, where, }) {
    const { matchClause, preComputedWhereFieldSubqueries, whereClause } = createMatchClause({
        matchNode,
        node,
        context,
        operation,
        where,
    });
    return cypher_builder_1.default.concat(matchClause, preComputedWhereFieldSubqueries, whereClause).build();
}
exports.translateTopLevelMatch = translateTopLevelMatch;
function createMatchClause({ matchNode, node, context, operation, where, }) {
    const { resolveTree } = context;
    const fulltextInput = (resolveTree.args.fulltext || {});
    let matchClause = new cypher_builder_1.default.Match(matchNode);
    let whereOperators = [];
    // TODO: removed deprecated fulltext translation
    if (Object.entries(fulltextInput).length) {
        if (Object.entries(fulltextInput).length > 1) {
            throw new Error("Can only call one search at any given time");
        }
        const [indexName, indexInput] = Object.entries(fulltextInput)[0];
        const phraseParam = new cypher_builder_1.default.Param(indexInput.phrase);
        matchClause = cypher_builder_1.default.db.index.fulltext.queryNodes(indexName, phraseParam).yield(["node", matchNode]);
        whereOperators = node.getLabels(context).map((label) => {
            return cypher_builder_1.default.in(new cypher_builder_1.default.Param(label), cypher_builder_1.default.labels(matchNode));
        });
    }
    else if (context.fulltext) {
        ({ matchClause, whereOperators } = createFulltextMatchClause(matchNode, where, node, context));
        where = where?.[node.singular];
    }
    let whereClause;
    const authorizationPredicateReturn = (0, create_authorization_before_predicate_1.createAuthorizationBeforePredicate)({
        context,
        nodes: [
            {
                variable: matchNode,
                node,
            },
        ],
        operations: [operation],
    });
    if (authorizationPredicateReturn?.predicate) {
        whereClause = new cypher_builder_1.default.With("*");
    }
    else {
        whereClause = matchClause;
    }
    let preComputedWhereFieldSubqueries;
    if (where) {
        const { predicate: whereOp, preComputedSubqueries } = (0, create_where_predicate_1.createWherePredicate)({
            targetElement: matchNode,
            whereInput: where,
            context,
            element: node,
        });
        preComputedWhereFieldSubqueries = preComputedSubqueries;
        if (preComputedWhereFieldSubqueries && !preComputedWhereFieldSubqueries.empty) {
            if (preComputedWhereFieldSubqueries.children.length === 1 &&
                preComputedWhereFieldSubqueries.children[0] instanceof cypher_builder_1.default.Match) {
                whereClause = preComputedWhereFieldSubqueries.children[0];
                preComputedWhereFieldSubqueries = undefined;
            }
            else {
                whereClause = new cypher_builder_1.default.With("*");
            }
        }
        if (whereOp)
            whereClause.where(whereOp);
    }
    if (whereOperators && whereOperators.length) {
        const andChecks = cypher_builder_1.default.and(...whereOperators);
        whereClause.where(andChecks);
    }
    if (authorizationPredicateReturn) {
        const { predicate, preComputedSubqueries } = authorizationPredicateReturn;
        if (predicate) {
            whereClause.where(predicate);
        }
        if (preComputedSubqueries && !preComputedSubqueries.empty) {
            preComputedWhereFieldSubqueries = cypher_builder_1.default.concat(preComputedWhereFieldSubqueries, preComputedSubqueries);
        }
    }
    if (matchClause === whereClause) {
        whereClause = undefined;
    }
    return {
        matchClause,
        preComputedWhereFieldSubqueries,
        whereClause,
    };
}
exports.createMatchClause = createMatchClause;
function createFulltextMatchClause(matchNode, whereInput, node, context) {
    if (!context.fulltext) {
        throw new Error("Full-text context not defined");
    }
    // TODO: remove indexName assignment and undefined check once the name argument has been removed.
    const indexName = context.fulltext.indexName || context.fulltext.name;
    if (indexName === undefined) {
        throw new Error("The name of the fulltext index should be defined using the indexName argument.");
    }
    const phraseParam = new cypher_builder_1.default.Param(context.resolveTree.args.phrase);
    const scoreVar = context.fulltext.scoreVariable;
    const matchClause = cypher_builder_1.default.db.index.fulltext
        .queryNodes(indexName, phraseParam)
        .yield(["node", matchNode], ["score", scoreVar]);
    const expectedLabels = node.getLabels(context);
    const labelsChecks = matchNode.hasLabels(...expectedLabels);
    const whereOperators = [];
    if (whereInput?.[fulltext_1.SCORE_FIELD]) {
        if (whereInput[fulltext_1.SCORE_FIELD].min || whereInput[fulltext_1.SCORE_FIELD].min === 0) {
            const scoreMinOp = cypher_builder_1.default.gte(scoreVar, new cypher_builder_1.default.Param(whereInput[fulltext_1.SCORE_FIELD].min));
            if (scoreMinOp)
                whereOperators.push(scoreMinOp);
        }
        if (whereInput[fulltext_1.SCORE_FIELD].max || whereInput[fulltext_1.SCORE_FIELD].max === 0) {
            const scoreMaxOp = cypher_builder_1.default.lte(scoreVar, new cypher_builder_1.default.Param(whereInput[fulltext_1.SCORE_FIELD].max));
            if (scoreMaxOp)
                whereOperators.push(scoreMaxOp);
        }
    }
    if (labelsChecks)
        whereOperators.push(labelsChecks);
    return {
        matchClause,
        whereOperators,
    };
}
//# sourceMappingURL=translate-top-level-match.js.map