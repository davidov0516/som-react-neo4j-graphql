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
exports.SubscriptionsAuthorizationFilterRule = exports.SubscriptionsAuthorizationAnnotation = exports.SubscriptionsAuthorizationFilterEventRule = exports.SubscriptionsAuthorizationAnnotationArguments = void 0;
exports.SubscriptionsAuthorizationAnnotationArguments = ["filter"];
exports.SubscriptionsAuthorizationFilterEventRule = [
    "CREATE",
    "UPDATE",
    "DELETE",
    "CREATE_RELATIONSHIP",
    "DELETE_RELATIONSHIP",
];
class SubscriptionsAuthorizationAnnotation {
    constructor({ filter }) {
        this.filter = filter;
    }
}
exports.SubscriptionsAuthorizationAnnotation = SubscriptionsAuthorizationAnnotation;
class SubscriptionsAuthorizationFilterRule {
    constructor({ events, requireAuthentication, where }) {
        this.events = events ?? [...exports.SubscriptionsAuthorizationFilterEventRule];
        this.requireAuthentication = requireAuthentication === undefined ? true : requireAuthentication;
        this.where = where;
    }
}
exports.SubscriptionsAuthorizationFilterRule = SubscriptionsAuthorizationFilterRule;
//# sourceMappingURL=SubscriptionsAuthorizationAnnotation.js.map