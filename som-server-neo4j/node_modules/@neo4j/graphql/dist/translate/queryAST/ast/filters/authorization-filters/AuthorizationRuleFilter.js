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
exports.AuthorizationRuleFilter = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const Filter_1 = require("../Filter");
class AuthorizationRuleFilter extends Filter_1.Filter {
    constructor({ requireAuthentication, filters, isAuthenticatedParam, }) {
        super();
        this.requireAuthentication = requireAuthentication;
        this.children = filters;
        this.isAuthenticatedParam = isAuthenticatedParam;
    }
    getPredicate(context) {
        let authenticationPredicate;
        if (this.requireAuthentication) {
            authenticationPredicate = cypher_builder_1.default.eq(this.isAuthenticatedParam, cypher_builder_1.default.true); // TODO: use it in the context
        }
        const innerPredicate = cypher_builder_1.default.and(authenticationPredicate, ...this.children.map((c) => c.getPredicate(context)));
        if (!innerPredicate)
            return undefined;
        return innerPredicate;
    }
    getSubqueries(context) {
        return this.children.flatMap((c) => c.getSubqueries(context));
    }
    getSelection(context) {
        return this.children.flatMap((c) => c.getSelection(context));
    }
    getChildren() {
        return [...this.children];
    }
}
exports.AuthorizationRuleFilter = AuthorizationRuleFilter;
//# sourceMappingURL=AuthorizationRuleFilter.js.map