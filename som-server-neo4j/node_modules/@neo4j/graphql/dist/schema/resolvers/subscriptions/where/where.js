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
exports.subscriptionWhere = void 0;
const filter_by_properties_1 = require("./filters/filter-by-properties");
const filter_by_relationship_properties_1 = require("./filters/filter-by-relationship-properties");
function subscriptionWhere({ where, event, entityAdapter, }) {
    if (!where) {
        return true;
    }
    if (event.event === "create") {
        return (0, filter_by_properties_1.filterByProperties)({
            attributes: entityAdapter.attributes,
            whereProperties: where,
            receivedProperties: event.properties.new,
        });
    }
    if (event.event === "update" || event.event === "delete") {
        return (0, filter_by_properties_1.filterByProperties)({
            attributes: entityAdapter.attributes,
            whereProperties: where,
            receivedProperties: event.properties.old,
        });
    }
    if (event.event === "create_relationship" || event.event === "delete_relationship") {
        // if (!nodes || !relationshipFields) {
        //     return false;
        // }
        return (0, filter_by_relationship_properties_1.filterByRelationshipProperties)({
            entityAdapter,
            whereProperties: where,
            receivedEvent: event,
        });
    }
    return false;
}
exports.subscriptionWhere = subscriptionWhere;
//# sourceMappingURL=where.js.map