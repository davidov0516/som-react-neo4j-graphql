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
exports.validateUserDefinition = void 0;
const graphql_1 = require("graphql");
const static_definitions_1 = require("../../graphql/directives/type-dependant-directives/static-definitions");
const authorization_1 = require("./enrichers/authorization");
const EnricherContext_1 = require("./EnricherContext");
const specifiedRules_1 = require("graphql/validation/specifiedRules");
const directive_argument_of_correct_type_1 = require("./custom-rules/directive-argument-of-correct-type");
const validate_sdl_1 = require("./validate-sdl");
const replace_wildcard_value_1 = require("./custom-rules/replace-wildcard-value");
const subscriptions_authorization_1 = require("./enrichers/subscriptions-authorization");
const authentication_1 = require("../../graphql/directives/type-dependant-directives/authentication");
const authentication_2 = require("./enrichers/authentication");
function getAdditionalDefinitions(jwt) {
    return [...(0, static_definitions_1.getStaticAuthorizationDefinitions)(jwt), (0, authentication_1.createAuthenticationDirectiveDefinition)()];
}
function enrichDocument(enrichers, additionalDefinitions, document) {
    return {
        ...document,
        definitions: enrichers
            .reduce((definitions, enricher) => definitions.reduce(enricher, []), document.definitions)
            .concat(...additionalDefinitions),
    };
}
function makeValidationDocument(userDocument, augmentedDocument, jwt) {
    const enricherContext = new EnricherContext_1.EnricherContext(userDocument, augmentedDocument);
    const enrichers = [];
    enrichers.push((0, authorization_1.authorizationDefinitionsEnricher)(enricherContext)); // Add Authorization directive definitions, for instance UserAuthorization
    enrichers.push((0, authorization_1.authorizationDirectiveEnricher)(enricherContext)); // Apply the previously generated directive definitions to the authorized types
    enrichers.push((0, subscriptions_authorization_1.subscriptionsAuthorizationDefinitionsEnricher)(enricherContext)); // Add SubscriptionsAuthorization directive definitions, for instance UserSubscriptionsAuthorization
    enrichers.push((0, subscriptions_authorization_1.subscriptionsAuthorizationDirectiveEnricher)(enricherContext)); // Apply the previously generated directive definitions to the authorized types
    enrichers.push((0, authentication_2.authenticationDirectiveEnricher)(enricherContext)); // Apply the previously generated directive definitions to the authenticated types
    const additionalDefinitions = getAdditionalDefinitions(jwt);
    return enrichDocument(enrichers, additionalDefinitions, augmentedDocument);
}
function validateUserDefinition({ userDocument, augmentedDocument, additionalDirectives = [], additionalTypes = [], rules, jwt, }) {
    rules = rules ? rules : [...specifiedRules_1.specifiedSDLRules, (0, directive_argument_of_correct_type_1.DirectiveArgumentOfCorrectType)()];
    let validationDocument = makeValidationDocument(userDocument, augmentedDocument, jwt);
    const schemaToExtend = new graphql_1.GraphQLSchema({
        directives: [...graphql_1.specifiedDirectives, ...additionalDirectives],
        types: [...additionalTypes],
    });
    const replaceWildcardValue = (0, replace_wildcard_value_1.makeReplaceWildcardVisitor)({ jwt, schema: schemaToExtend });
    validationDocument = (0, graphql_1.visit)(validationDocument, replaceWildcardValue());
    const errors = (0, validate_sdl_1.validateSDL)(validationDocument, rules, schemaToExtend);
    if (errors.length) {
        throw errors;
    }
}
exports.validateUserDefinition = validateUserDefinition;
//# sourceMappingURL=schema-validation.js.map