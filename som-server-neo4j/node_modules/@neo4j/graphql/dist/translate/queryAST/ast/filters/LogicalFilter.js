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
exports.LogicalFilter = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const utils_1 = require("../../../../utils/utils");
const Filter_1 = require("./Filter");
class LogicalFilter extends Filter_1.Filter {
    constructor({ operation, filters }) {
        super();
        this.operation = operation;
        this.children = filters;
    }
    getChildren() {
        return [...this.children];
    }
    print() {
        return `${super.print()} <${this.operation}>`;
    }
    getSubqueries(context) {
        return this.children.flatMap((c) => c.getSubqueries(context));
    }
    getSelection(context) {
        return this.getChildren().flatMap((c) => c.getSelection(context));
    }
    getPredicate(queryASTContext) {
        const predicates = (0, utils_1.filterTruthy)(this.children.map((f) => f.getPredicate(queryASTContext)));
        switch (this.operation) {
            case "NOT": {
                if (predicates.length === 0)
                    return undefined;
                return cypher_builder_1.default.not(cypher_builder_1.default.and(...predicates));
            }
            case "AND": {
                return cypher_builder_1.default.and(...predicates);
            }
            case "OR": {
                return cypher_builder_1.default.or(...predicates);
            }
        }
    }
}
exports.LogicalFilter = LogicalFilter;
//# sourceMappingURL=LogicalFilter.js.map