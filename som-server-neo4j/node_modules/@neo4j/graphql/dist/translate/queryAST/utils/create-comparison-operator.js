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
exports.createComparisonOperation = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
/** Returns the default operation for a given filter */
function createComparisonOperation({ operator, property, param, }) {
    switch (operator) {
        case "LT":
            return cypher_builder_1.default.lt(property, param);
        case "LTE":
            return cypher_builder_1.default.lte(property, param);
        case "GT":
            return cypher_builder_1.default.gt(property, param);
        case "GTE":
            return cypher_builder_1.default.gte(property, param);
        case "ENDS_WITH":
            return cypher_builder_1.default.endsWith(property, param);
        case "STARTS_WITH":
            return cypher_builder_1.default.startsWith(property, param);
        case "MATCHES":
            return cypher_builder_1.default.matches(property, param);
        case "CONTAINS":
            return cypher_builder_1.default.contains(property, param);
        case "IN":
            return cypher_builder_1.default.in(property, param);
        case "INCLUDES":
            return cypher_builder_1.default.in(param, property);
        case "EQ":
            return cypher_builder_1.default.eq(property, param);
        default:
            throw new Error(`Invalid operator ${operator}`);
    }
}
exports.createComparisonOperation = createComparisonOperation;
//# sourceMappingURL=create-comparison-operator.js.map