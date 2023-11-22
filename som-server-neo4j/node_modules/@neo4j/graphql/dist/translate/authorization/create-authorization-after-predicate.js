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
exports.createAuthorizationAfterPredicate = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_authorization_validate_predicate_1 = require("./rules/create-authorization-validate-predicate");
function createNodePredicate({ context, variable, node, operations, fieldName, conditionForEvaluation, }) {
    const concreteEntities = context.schemaModel.getEntitiesByNameAndLabels(node.name, node.getAllLabels());
    if (concreteEntities.length !== 1) {
        throw new Error("Couldn't match entity");
    }
    const concreteEntity = concreteEntities[0];
    const authorizationPredicate = createNodeAuthorizationPredicate({
        context,
        node,
        entity: concreteEntity,
        variable,
        operations,
        fieldName,
        conditionForEvaluation,
    });
    return {
        predicate: authorizationPredicate?.predicate,
        preComputedSubqueries: authorizationPredicate?.preComputedSubqueries,
    };
}
function createNodeAuthorizationPredicate({ context, node, entity, variable, operations, fieldName, conditionForEvaluation, }) {
    const annotation = fieldName
        ? entity.attributes.get(fieldName)?.annotations.authorization
        : entity.annotations.authorization;
    if (!annotation) {
        return;
    }
    return (0, create_authorization_validate_predicate_1.createAuthorizationValidatePredicate)({
        when: "AFTER",
        context,
        node: node,
        rules: annotation.validate || [],
        variable,
        operations,
        conditionForEvaluation,
    });
}
function createAuthorizationAfterPredicate({ context, nodes, operations, conditionForEvaluation, }) {
    const predicates = [];
    let subqueries;
    for (const nodeEntry of nodes) {
        const { node, variable, fieldName } = nodeEntry;
        const predicateReturn = createNodePredicate({
            context,
            node,
            variable,
            fieldName,
            operations,
            conditionForEvaluation,
        });
        if (!predicateReturn) {
            continue;
        }
        const { predicate, preComputedSubqueries } = predicateReturn;
        if (predicate) {
            predicates.push(predicate);
        }
        if (preComputedSubqueries) {
            subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
        }
    }
    if (!predicates.length) {
        return undefined;
    }
    return {
        predicate: cypher_builder_1.default.and(...predicates),
        preComputedSubqueries: subqueries,
    };
}
exports.createAuthorizationAfterPredicate = createAuthorizationAfterPredicate;
//# sourceMappingURL=create-authorization-after-predicate.js.map