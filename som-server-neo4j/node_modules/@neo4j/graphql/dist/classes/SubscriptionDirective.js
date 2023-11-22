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
exports.SubscriptionDirective = void 0;
const subscription_1 = require("../graphql/directives/subscription");
class SubscriptionDirective {
    constructor(operations) {
        const operationsSet = new Set(operations);
        this.created = operationsSet.has(subscription_1.SubscriptionEvent.CREATED);
        this.updated = operationsSet.has(subscription_1.SubscriptionEvent.UPDATED);
        this.deleted = operationsSet.has(subscription_1.SubscriptionEvent.DELETED);
        this.relationshipCreated = operationsSet.has(subscription_1.SubscriptionEvent.RELATIONSHIP_CREATED);
        this.relationshipDeleted = operationsSet.has(subscription_1.SubscriptionEvent.RELATIONSHIP_DELETED);
    }
}
exports.SubscriptionDirective = SubscriptionDirective;
//# sourceMappingURL=SubscriptionDirective.js.map