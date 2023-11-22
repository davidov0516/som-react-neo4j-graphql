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
exports.createBaseOperation = exports.createComparisonOperation = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_point_comparison_operation_1 = require("./create-point-comparison-operation");
/** Translates an atomic comparison operation (e.g. "this0 <= $param0") */
function createComparisonOperation({ operator, propertyRefOrCoalesce, param, durationField, pointField, }) {
    // TODO: consider if this conditional is the correct solution - should we make the function compatible?
    if (!(param instanceof cypher_builder_1.default.Function) && pointField) {
        return (0, create_point_comparison_operation_1.createPointComparisonOperation)({
            operator,
            propertyRefOrCoalesce,
            param,
            pointField,
        });
    }
    // Comparison operations requires adding dates to durations
    // See https://neo4j.com/developer/cypher/dates-datetimes-durations/#comparing-filtering-values
    if (durationField && operator) {
        return createDurationOperation({ operator, property: propertyRefOrCoalesce, param });
    }
    return createBaseOperation({
        operator: operator || "EQ",
        target: propertyRefOrCoalesce,
        value: param,
    });
}
exports.createComparisonOperation = createComparisonOperation;
function createDurationOperation({ operator, property, param, }) {
    const variable = cypher_builder_1.default.plus(cypher_builder_1.default.datetime(), param);
    const propertyRef = cypher_builder_1.default.plus(cypher_builder_1.default.datetime(), property);
    return createBaseOperation({
        operator,
        target: propertyRef,
        value: variable,
    });
}
function createBaseOperation({ operator, target, value, }) {
    switch (operator) {
        case "LT":
            return cypher_builder_1.default.lt(target, value);
        case "LTE":
            return cypher_builder_1.default.lte(target, value);
        case "GT":
            return cypher_builder_1.default.gt(target, value);
        case "GTE":
            return cypher_builder_1.default.gte(target, value);
        case "ENDS_WITH":
        case "NOT_ENDS_WITH":
            return cypher_builder_1.default.endsWith(target, value);
        case "STARTS_WITH":
        case "NOT_STARTS_WITH":
            return cypher_builder_1.default.startsWith(target, value);
        case "MATCHES":
            return cypher_builder_1.default.matches(target, value);
        case "CONTAINS":
        case "NOT_CONTAINS":
            return cypher_builder_1.default.contains(target, value);
        case "IN":
        case "NOT_IN":
            return cypher_builder_1.default.in(target, value);
        case "INCLUDES":
        case "NOT_INCLUDES":
            return cypher_builder_1.default.in(value, target);
        case "EQ":
        case "EQUAL":
        case "NOT":
            return cypher_builder_1.default.eq(target, value);
        default:
            throw new Error(`Invalid operator ${operator}`);
    }
}
exports.createBaseOperation = createBaseOperation;
//# sourceMappingURL=create-comparison-operation.js.map