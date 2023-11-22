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
exports.AuthorizationFilters = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const constants_1 = require("../../../../../constants");
const Filter_1 = require("../Filter");
class AuthorizationFilters extends Filter_1.Filter {
    constructor({ validationFilters, whereFilters, }) {
        super();
        // Maybe we can merge these into a single array
        this.validationFilters = [];
        this.whereFilters = [];
        this.validationFilters = validationFilters;
        this.whereFilters = whereFilters;
    }
    addValidationFilter(filter) {
        this.validationFilters.push(filter);
    }
    addWhereFilter(filter) {
        this.whereFilters.push(filter);
    }
    getPredicate(context) {
        const validateInnerPredicate = cypher_builder_1.default.or(...this.validationFilters.map((f) => f.getPredicate(context)));
        const wherePredicate = cypher_builder_1.default.or(...this.whereFilters.map((f) => f.getPredicate(context)));
        let validatePredicate;
        if (validateInnerPredicate) {
            validatePredicate = cypher_builder_1.default.apoc.util.validatePredicate(cypher_builder_1.default.not(validateInnerPredicate), constants_1.AUTH_FORBIDDEN_ERROR);
        }
        return cypher_builder_1.default.and(wherePredicate, validatePredicate);
    }
    getSubqueries(context) {
        return [...this.validationFilters, ...this.whereFilters].flatMap((c) => c.getSubqueries(context));
    }
    getSelection(context) {
        return [...this.validationFilters, ...this.whereFilters].flatMap((c) => c.getSelection(context));
    }
    getChildren() {
        return [...this.validationFilters, ...this.whereFilters];
    }
}
exports.AuthorizationFilters = AuthorizationFilters;
//# sourceMappingURL=AuthorizationFilters.js.map