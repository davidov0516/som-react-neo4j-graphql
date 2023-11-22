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
exports.authorizationDirectiveEnricher = exports.authorizationDefinitionsEnricher = void 0;
const graphql_1 = require("graphql");
const authorization_1 = require("../../../graphql/directives/type-dependant-directives/authorization");
const definitions_1 = require("./directive/definitions");
const directive_1 = require("./directive/directive");
// currentDirectiveDirective is of type ConstDirectiveNode, has to be any to support GraphQL 15
function getAuthorizationDirective(currentDirectiveDirective, typeName) {
    return {
        ...currentDirectiveDirective,
        name: {
            kind: graphql_1.Kind.NAME,
            value: `${typeName}Authorization`,
        },
    };
}
// Enriches the directive definition itself
function authorizationDefinitionsEnricher(enricherContext) {
    return (0, definitions_1.definitionsEnricher)(enricherContext, "authorization", authorization_1.createAuthorizationDefinitions);
}
exports.authorizationDefinitionsEnricher = authorizationDefinitionsEnricher;
// Enriches the applied directives on objects, interfaces and fields
function authorizationDirectiveEnricher(enricherContext) {
    return (0, directive_1.directiveEnricher)(enricherContext, "authorization", getAuthorizationDirective);
}
exports.authorizationDirectiveEnricher = authorizationDirectiveEnricher;
//# sourceMappingURL=authorization.js.map