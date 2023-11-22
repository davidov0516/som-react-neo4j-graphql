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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationFactory = void 0;
const AuthorizationRuleFilter_1 = require("../ast/filters/authorization-filters/AuthorizationRuleFilter");
const find_matching_rules_1 = require("../../authorization/utils/find-matching-rules");
const populate_where_params_1 = require("../../authorization/utils/populate-where-params");
const AuthorizationFilters_1 = require("../ast/filters/authorization-filters/AuthorizationFilters");
class AuthorizationFactory {
    constructor(filterFactory) {
        this.filterFactory = filterFactory;
    }
    createEntityAuthFilters(entity, operations, context) {
        const authAnnotation = entity.annotations.authorization;
        if (!authAnnotation)
            return undefined;
        return this.createAuthFilterRule({
            entity,
            operations,
            context,
            authAnnotation,
        });
    }
    createAttributeAuthFilters(attribute, entity, operations, context) {
        const authAnnotation = attribute.annotations.authorization;
        if (!authAnnotation)
            return undefined;
        return this.createAuthFilterRule({
            entity,
            operations,
            context,
            authAnnotation,
        });
    }
    createAuthFilterRule({ entity, authAnnotation, operations, context, }) {
        const rulesMatchingOperations = (0, find_matching_rules_1.findMatchingRules)(authAnnotation.validate ?? [], operations);
        const rulesMatchingWhereOperations = (0, find_matching_rules_1.findMatchingRules)(authAnnotation.filter ?? [], operations);
        const validationFilers = rulesMatchingOperations.flatMap((rule) => {
            const populatedWhere = (0, populate_where_params_1.populateWhereParams)({ where: rule.where, context }); // TODO: move this to the filterFactory?
            const nestedFilters = this.filterFactory.createAuthFilters({
                entity,
                operations,
                context,
                populatedWhere,
            });
            return new AuthorizationRuleFilter_1.AuthorizationRuleFilter({
                requireAuthentication: rule.requireAuthentication,
                filters: nestedFilters,
                isAuthenticatedParam: context.authorization.isAuthenticatedParam,
            });
        });
        const whereFilters = rulesMatchingWhereOperations.flatMap((rule) => {
            const populatedWhere = (0, populate_where_params_1.populateWhereParams)({ where: rule.where, context });
            const nestedFilters = this.filterFactory.createAuthFilters({
                entity,
                operations,
                context,
                populatedWhere,
            });
            return new AuthorizationRuleFilter_1.AuthorizationRuleFilter({
                requireAuthentication: rule.requireAuthentication,
                filters: nestedFilters,
                isAuthenticatedParam: context.authorization.isAuthenticatedParam,
            });
        });
        return new AuthorizationFilters_1.AuthorizationFilters({
            validationFilters: validationFilers,
            whereFilters: whereFilters,
        });
    }
}
exports.AuthorizationFactory = AuthorizationFactory;
//# sourceMappingURL=AuthorizationFactory.js.map