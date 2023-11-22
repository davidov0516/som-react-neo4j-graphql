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
exports.generateSubscribeMethod = exports.subscriptionResolve = void 0;
const events_1 = require("events");
const classes_1 = require("../../../classes");
const check_authentication_1 = require("./authentication/check-authentication");
const check_authentication_selection_set_1 = require("./authentication/check-authentication-selection-set");
const filter_async_iterator_1 = require("./filter-async-iterator");
const update_diff_filter_1 = require("./update-diff-filter");
const authorization_1 = require("./where/authorization");
const where_1 = require("./where/where");
function subscriptionResolve(payload) {
    if (!payload) {
        throw new classes_1.Neo4jGraphQLError("Payload is undefined. Can't call subscriptions resolver directly.");
    }
    return payload[0];
}
exports.subscriptionResolve = subscriptionResolve;
function generateSubscribeMethod({ entityAdapter, type, }) {
    return (_root, args, context, resolveInfo) => {
        (0, check_authentication_selection_set_1.checkAuthenticationOnSelectionSet)(resolveInfo, entityAdapter, type, context);
        (0, check_authentication_1.checkAuthentication)({ authenticated: entityAdapter, operation: "SUBSCRIBE", context });
        const iterable = (0, events_1.on)(context.subscriptionsEngine.events, type);
        if (["create", "update", "delete"].includes(type)) {
            return (0, filter_async_iterator_1.filterAsyncIterator)(iterable, (data) => {
                return (data[0].typename === entityAdapter.name &&
                    (0, authorization_1.subscriptionAuthorization)({ event: data[0], entity: entityAdapter, context }) &&
                    (0, where_1.subscriptionWhere)({ where: args.where, event: data[0], entityAdapter }) &&
                    (0, update_diff_filter_1.updateDiffFilter)(data[0]));
            });
        }
        if (["create_relationship", "delete_relationship"].includes(type)) {
            return (0, filter_async_iterator_1.filterAsyncIterator)(iterable, (data) => {
                const relationEventPayload = data[0];
                const isOfRelevantType = relationEventPayload.toTypename === entityAdapter.name ||
                    relationEventPayload.fromTypename === entityAdapter.name;
                if (!isOfRelevantType) {
                    return false;
                }
                const relationFieldName = Array.from(entityAdapter.relationships.values()).find((r) => r.type === relationEventPayload.relationshipName)?.name;
                return (!!relationFieldName &&
                    (0, authorization_1.subscriptionAuthorization)({
                        event: data[0],
                        entity: entityAdapter,
                        context,
                    }) &&
                    (0, where_1.subscriptionWhere)({ where: args.where, event: data[0], entityAdapter }));
            });
        }
        throw new classes_1.Neo4jGraphQLError(`Invalid type in subscription: ${type}`);
    };
}
exports.generateSubscribeMethod = generateSubscribeMethod;
//# sourceMappingURL=subscribe.js.map