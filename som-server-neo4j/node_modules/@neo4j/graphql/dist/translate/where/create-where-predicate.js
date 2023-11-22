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
exports.createWherePredicate = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
// Recursive function
const create_property_where_1 = require("./property-operations/create-property-where");
const logical_operators_1 = require("../utils/logical-operators");
const utils_1 = require("../../utils/utils");
/** Translate a target node and GraphQL input into a Cypher operation or valid where expression */
function createWherePredicate({ targetElement, whereInput, context, element, useExistExpr = true, checkParameterExistence, }) {
    const whereFields = Object.entries(whereInput);
    const predicates = [];
    let subqueries;
    whereFields.forEach(([key, value]) => {
        if ((0, logical_operators_1.isLogicalOperator)(key)) {
            const { predicate, preComputedSubqueries } = createNestedPredicate({
                key: key,
                element,
                targetElement,
                context,
                value: (0, utils_1.asArray)(value),
                useExistExpr,
                checkParameterExistence,
            });
            if (predicate) {
                predicates.push(predicate);
                if (preComputedSubqueries && !preComputedSubqueries.empty)
                    subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
            }
            return;
        }
        const { predicate, preComputedSubqueries } = (0, create_property_where_1.createPropertyWhere)({
            key,
            value,
            element,
            targetElement,
            context,
            useExistExpr,
            checkParameterExistence,
        });
        if (predicate) {
            predicates.push(predicate);
            if (preComputedSubqueries && !preComputedSubqueries.empty)
                subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
            return;
        }
    });
    // Implicit AND
    return {
        predicate: cypher_builder_1.default.and(...predicates),
        preComputedSubqueries: subqueries,
    };
}
exports.createWherePredicate = createWherePredicate;
function createNestedPredicate({ key, element, targetElement, context, value, useExistExpr, checkParameterExistence, }) {
    const nested = [];
    let subqueries;
    value.forEach((v) => {
        const { predicate, preComputedSubqueries } = createWherePredicate({
            whereInput: v,
            element,
            targetElement,
            context,
            useExistExpr,
            checkParameterExistence,
        });
        if (predicate) {
            nested.push(predicate);
        }
        if (preComputedSubqueries && !preComputedSubqueries.empty)
            subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
    });
    const logicalPredicate = (0, logical_operators_1.getLogicalPredicate)(key, (0, utils_1.filterTruthy)(nested));
    return { predicate: logicalPredicate, preComputedSubqueries: subqueries };
}
//# sourceMappingURL=create-where-predicate.js.map