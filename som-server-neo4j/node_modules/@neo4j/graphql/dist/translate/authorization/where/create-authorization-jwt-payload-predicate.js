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
exports.createJwtPayloadWherePredicate = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const utils_1 = require("../../../utils/utils");
const get_or_create_cypher_variable_1 = require("../../utils/get-or-create-cypher-variable");
const logical_operators_1 = require("../../utils/logical-operators");
const create_parameter_where_1 = require("../../where/create-parameter-where");
function createJwtPayloadWherePredicate({ where, context, }) {
    const fields = Object.entries(where);
    const predicates = [];
    get_or_create_cypher_variable_1.getOrCreateCypherVariable;
    fields.forEach(([key, value]) => {
        if ((0, logical_operators_1.isLogicalOperator)(key)) {
            const predicate = createNestedPredicate({
                key,
                value: (0, utils_1.asArray)(value),
                context,
            });
            if (predicate) {
                predicates.push(predicate);
            }
            return;
        }
        const predicate = (0, create_parameter_where_1.createParameterWhere)({
            key,
            value,
            context,
        });
        if (predicate) {
            predicates.push(predicate);
            return;
        }
    });
    // Implicit AND
    return cypher_builder_1.default.and(...predicates);
}
exports.createJwtPayloadWherePredicate = createJwtPayloadWherePredicate;
function createNestedPredicate({ key, value, context, }) {
    const nested = [];
    value.forEach((v) => {
        const predicate = createJwtPayloadWherePredicate({
            where: v,
            context,
        });
        if (predicate) {
            nested.push(predicate);
        }
    });
    return (0, logical_operators_1.getLogicalPredicate)(key, nested);
}
//# sourceMappingURL=create-authorization-jwt-payload-predicate.js.map