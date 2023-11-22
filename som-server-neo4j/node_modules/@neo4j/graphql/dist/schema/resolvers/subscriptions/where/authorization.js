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
exports.subscriptionAuthorization = void 0;
const filter_by_authorization_rules_1 = require("./filters/filter-by-authorization-rules");
const multiple_conditions_aggregation_map_1 = require("./utils/multiple-conditions-aggregation-map");
const populate_where_params_1 = require("./utils/populate-where-params");
function subscriptionAuthorization({ event, entity, context, }) {
    const subscriptionsAuthorization = entity.annotations.subscriptionsAuthorization;
    const matchedRules = (subscriptionsAuthorization?.filter || []).filter((rule) => rule.events.some((e) => e.toLowerCase() === event.event));
    if (!matchedRules.length) {
        return true;
    }
    const results = matchedRules.map((rule) => {
        if (rule.requireAuthentication && !context.authorization.jwt) {
            return false;
        }
        const where = (0, populate_where_params_1.populateWhereParams)({ where: rule.where, context });
        return (0, filter_by_authorization_rules_1.filterByAuthorizationRules)({
            entityAdapter: entity,
            where,
            event,
            context,
        });
    });
    return multiple_conditions_aggregation_map_1.multipleConditionsAggregationMap.OR(results);
}
exports.subscriptionAuthorization = subscriptionAuthorization;
//# sourceMappingURL=authorization.js.map