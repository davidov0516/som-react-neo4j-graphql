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
exports.createAuthorizationWherePredicate = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const utils_1 = require("../../../utils/utils");
const logical_operators_1 = require("../../utils/logical-operators");
const create_where_predicate_1 = require("../../where/create-where-predicate");
const create_authorization_jwt_payload_predicate_1 = require("./create-authorization-jwt-payload-predicate");
const populate_where_params_1 = require("../utils/populate-where-params");
function createAuthorizationWherePredicate({ where, context, node, target, }) {
    const fields = Object.entries(where);
    const predicates = [];
    let subqueries;
    fields.forEach(([key, value]) => {
        if ((0, logical_operators_1.isLogicalOperator)(key)) {
            const { predicate, preComputedSubqueries } = createNestedPredicate({
                key,
                context,
                value: (0, utils_1.asArray)(value),
                node,
                target,
            });
            if (predicate) {
                predicates.push(predicate);
            }
            if (preComputedSubqueries && !preComputedSubqueries.empty) {
                subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
            }
            return;
        }
        if (key === "node") {
            const useExistExpr = context.neo4jDatabaseInfo?.gte("5");
            const { predicate, preComputedSubqueries } = (0, create_where_predicate_1.createWherePredicate)({
                element: node,
                context,
                // This doesn't _have_ to be done like this, we could just populate with the actual values instead of this approach - to discuss with Andres!
                whereInput: (0, populate_where_params_1.populateWhereParams)({ where: value, context }),
                targetElement: target,
                useExistExpr,
                checkParameterExistence: true,
            });
            if (predicate) {
                predicates.push(predicate);
            }
            if (preComputedSubqueries && !preComputedSubqueries.empty) {
                subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
            }
            return;
        }
        if (key === "jwt") {
            const predicate = (0, create_authorization_jwt_payload_predicate_1.createJwtPayloadWherePredicate)({ where: value, context });
            if (predicate) {
                predicates.push(predicate);
            }
            return;
        }
    });
    // Implicit AND
    return {
        predicate: cypher_builder_1.default.and(...predicates),
        preComputedSubqueries: subqueries,
    };
}
exports.createAuthorizationWherePredicate = createAuthorizationWherePredicate;
function createNestedPredicate({ key, context, value, node, target, }) {
    const nested = [];
    let subqueries;
    value.forEach((v) => {
        const { predicate, preComputedSubqueries } = createAuthorizationWherePredicate({
            where: v,
            context,
            node,
            target,
        });
        if (predicate) {
            nested.push(predicate);
        }
        if (preComputedSubqueries && !preComputedSubqueries.empty) {
            subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
        }
    });
    return { predicate: (0, logical_operators_1.getLogicalPredicate)(key, nested), preComputedSubqueries: subqueries };
}
//# sourceMappingURL=create-authorization-where-predicate.js.map