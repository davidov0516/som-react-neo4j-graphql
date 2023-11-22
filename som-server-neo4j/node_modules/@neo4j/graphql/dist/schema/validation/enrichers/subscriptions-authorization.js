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
exports.subscriptionsAuthorizationDirectiveEnricher = exports.subscriptionsAuthorizationDefinitionsEnricher = void 0;
const graphql_1 = require("graphql");
const subscriptions_authorization_1 = require("../../../graphql/directives/type-dependant-directives/subscriptions-authorization");
const definitions_1 = require("./directive/definitions");
const directive_1 = require("./directive/directive");
// currentDirectiveDirective is of type ConstDirectiveNode, has to be any to support GraphQL 15
function getSubscriptionsAuthorizationDirective(currentDirectiveDirective, typeName) {
    return {
        ...currentDirectiveDirective,
        name: {
            kind: graphql_1.Kind.NAME,
            value: `${typeName}SubscriptionsAuthorization`,
        },
    };
}
// Enriches the directive definition itself
function subscriptionsAuthorizationDefinitionsEnricher(enricherContext) {
    return (0, definitions_1.definitionsEnricher)(enricherContext, "subscriptionsAuthorization", subscriptions_authorization_1.createSubscriptionsAuthorizationDefinitions);
}
exports.subscriptionsAuthorizationDefinitionsEnricher = subscriptionsAuthorizationDefinitionsEnricher;
// Enriches the applied directives on objects, interfaces and fields
function subscriptionsAuthorizationDirectiveEnricher(enricherContext) {
    return (0, directive_1.directiveEnricher)(enricherContext, "subscriptionsAuthorization", getSubscriptionsAuthorizationDirective);
}
exports.subscriptionsAuthorizationDirectiveEnricher = subscriptionsAuthorizationDirectiveEnricher;
//# sourceMappingURL=subscriptions-authorization.js.map