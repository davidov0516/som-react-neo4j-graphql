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
exports.AuthRelationshipFilter = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const RelationshipFilter_1 = require("../RelationshipFilter");
class AuthRelationshipFilter extends RelationshipFilter_1.RelationshipFilter {
    getPredicate(queryASTContext) {
        if (this.subqueryPredicate)
            return this.subqueryPredicate;
        const nestedContext = this.getNestedContext(queryASTContext);
        if (this.shouldCreateOptionalMatch()) {
            const predicates = this.targetNodeFilters.map((c) => c.getPredicate(nestedContext));
            const innerPredicate = cypher_builder_1.default.and(...predicates);
            return cypher_builder_1.default.and(cypher_builder_1.default.neq(this.countVariable, new cypher_builder_1.default.Literal(0)), innerPredicate);
        }
        const pattern = new cypher_builder_1.default.Pattern(nestedContext.source)
            .withoutLabels()
            .related(nestedContext.relationship)
            .withDirection(this.relationship.getCypherDirection())
            .withoutVariable()
            .to(nestedContext.target);
        const predicate = this.createRelationshipOperation(pattern, nestedContext);
        if (!predicate)
            return undefined;
        return this.wrapInNotIfNeeded(predicate);
    }
    createRelationshipOperation(pattern, queryASTContext) {
        const predicates = this.targetNodeFilters.map((c) => c.getPredicate(queryASTContext));
        const innerPredicate = cypher_builder_1.default.and(...predicates);
        switch (this.operator) {
            case "ALL": {
                if (!innerPredicate)
                    return undefined;
                const match = new cypher_builder_1.default.Match(pattern).where(innerPredicate);
                const negativeMatch = new cypher_builder_1.default.Match(pattern).where(cypher_builder_1.default.not(innerPredicate));
                // Testing "ALL" requires testing that at least one element exists and that no elements not matching the filter exists
                return cypher_builder_1.default.and(new cypher_builder_1.default.Exists(match), cypher_builder_1.default.not(new cypher_builder_1.default.Exists(negativeMatch)));
            }
            case "SINGLE": {
                if (!innerPredicate)
                    return undefined;
                return this.getSingleRelationshipOperation({
                    pattern,
                    queryASTContext,
                    innerPredicate,
                });
            }
            case "NONE":
            case "SOME": {
                if (!this.relationship.isList && this.relationship.isNullable) {
                    if (!innerPredicate)
                        return undefined;
                    return this.getSingleRelationshipOperation({
                        pattern,
                        queryASTContext,
                        innerPredicate,
                    });
                }
                const patternComprehension = new cypher_builder_1.default.PatternComprehension(pattern, new cypher_builder_1.default.Literal(1));
                if (innerPredicate) {
                    patternComprehension.where(innerPredicate);
                }
                return cypher_builder_1.default.gt(cypher_builder_1.default.size(patternComprehension), new cypher_builder_1.default.Literal(0));
            }
        }
    }
}
exports.AuthRelationshipFilter = AuthRelationshipFilter;
//# sourceMappingURL=AuthRelationshipFilter.js.map