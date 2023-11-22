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
exports.parseAnnotations = void 0;
const coalesce_annotation_1 = require("./annotations-parser/coalesce-annotation");
const cypher_annotation_1 = require("./annotations-parser/cypher-annotation");
const custom_resolver_annotation_1 = require("./annotations-parser/custom-resolver-annotation");
const default_annotation_1 = require("./annotations-parser/default-annotation");
const filterable_annotation_1 = require("./annotations-parser/filterable-annotation");
const mutation_annotation_1 = require("./annotations-parser/mutation-annotation");
const plural_annotation_1 = require("./annotations-parser/plural-annotation");
const populated_by_annotation_1 = require("./annotations-parser/populated-by-annotation");
const private_annotation_1 = require("./annotations-parser/private-annotation");
const query_annotation_1 = require("./annotations-parser/query-annotation");
const limit_annotation_1 = require("./annotations-parser/limit-annotation");
const selectable_annotation_1 = require("./annotations-parser/selectable-annotation");
const settable_annotation_1 = require("./annotations-parser/settable-annotation");
const subscription_annotation_1 = require("./annotations-parser/subscription-annotation");
const timestamp_annotation_1 = require("./annotations-parser/timestamp-annotation");
const unique_annotation_1 = require("./annotations-parser/unique-annotation");
const full_text_annotation_1 = require("./annotations-parser/full-text-annotation");
const jwt_claim_annotation_1 = require("./annotations-parser/jwt-claim-annotation");
const jwt_payload_annotation_1 = require("./annotations-parser/jwt-payload-annotation");
const authorization_annotation_1 = require("./annotations-parser/authorization-annotation");
const authentication_annotation_1 = require("./annotations-parser/authentication-annotation");
const subscriptions_authorization_annotation_1 = require("./annotations-parser/subscriptions-authorization-annotation");
const Annotation_1 = require("../annotation/Annotation");
const IDAnnotation_1 = require("../annotation/IDAnnotation");
const RelayIDAnnotation_1 = require("../annotation/RelayIDAnnotation");
function parseAnnotations(directives) {
    const annotations = directives.reduce((directivesMap, directive) => {
        if (directivesMap.has(directive.name.value)) {
            // TODO: takes the first one
            // multiple interfaces can have this annotation - must constrain this flexibility by design
            return directivesMap;
        }
        const annotation = parseDirective(directive);
        if (annotation) {
            directivesMap.set(directive.name.value, annotation);
        }
        return directivesMap;
    }, new Map());
    return Array.from(annotations.values());
}
exports.parseAnnotations = parseAnnotations;
function parseDirective(directive) {
    switch (directive.name.value) {
        case Annotation_1.AnnotationsKey.authentication:
            return (0, authentication_annotation_1.parseAuthenticationAnnotation)(directive);
        case Annotation_1.AnnotationsKey.authorization:
            return (0, authorization_annotation_1.parseAuthorizationAnnotation)(directive);
        case Annotation_1.AnnotationsKey.coalesce:
            return (0, coalesce_annotation_1.parseCoalesceAnnotation)(directive);
        case Annotation_1.AnnotationsKey.customResolver:
            return (0, custom_resolver_annotation_1.parseCustomResolverAnnotation)(directive);
        case Annotation_1.AnnotationsKey.cypher:
            return (0, cypher_annotation_1.parseCypherAnnotation)(directive);
        case Annotation_1.AnnotationsKey.default:
            return (0, default_annotation_1.parseDefaultAnnotation)(directive);
        case Annotation_1.AnnotationsKey.filterable:
            return (0, filterable_annotation_1.parseFilterableAnnotation)(directive);
        case Annotation_1.AnnotationsKey.fulltext:
            return (0, full_text_annotation_1.parseFullTextAnnotation)(directive);
        case Annotation_1.AnnotationsKey.id:
            return new IDAnnotation_1.IDAnnotation();
        case Annotation_1.AnnotationsKey.jwtClaim:
            return (0, jwt_claim_annotation_1.parseJWTClaimAnnotation)(directive);
        case Annotation_1.AnnotationsKey.jwtPayload:
            return (0, jwt_payload_annotation_1.parseJWTPayloadAnnotation)(directive);
        case Annotation_1.AnnotationsKey.mutation:
            return (0, mutation_annotation_1.parseMutationAnnotation)(directive);
        case Annotation_1.AnnotationsKey.plural:
            return (0, plural_annotation_1.parsePluralAnnotation)(directive);
        case Annotation_1.AnnotationsKey.populatedBy:
            return (0, populated_by_annotation_1.parsePopulatedByAnnotation)(directive);
        case Annotation_1.AnnotationsKey.private:
            return (0, private_annotation_1.parsePrivateAnnotation)(directive);
        case Annotation_1.AnnotationsKey.query:
            return (0, query_annotation_1.parseQueryAnnotation)(directive);
        case Annotation_1.AnnotationsKey.limit:
            return (0, limit_annotation_1.parseLimitAnnotation)(directive);
        case Annotation_1.AnnotationsKey.selectable:
            return (0, selectable_annotation_1.parseSelectableAnnotation)(directive);
        case Annotation_1.AnnotationsKey.settable:
            return (0, settable_annotation_1.parseSettableAnnotation)(directive);
        case Annotation_1.AnnotationsKey.subscription:
            return (0, subscription_annotation_1.parseSubscriptionAnnotation)(directive);
        case Annotation_1.AnnotationsKey.subscriptionsAuthorization:
            return (0, subscriptions_authorization_annotation_1.parseSubscriptionsAuthorizationAnnotation)(directive);
        case Annotation_1.AnnotationsKey.timestamp:
            return (0, timestamp_annotation_1.parseTimestampAnnotation)(directive);
        case Annotation_1.AnnotationsKey.unique:
            return (0, unique_annotation_1.parseUniqueAnnotation)(directive);
        case Annotation_1.AnnotationsKey.relayId:
            return new RelayIDAnnotation_1.RelayIDAnnotation();
        default:
            return undefined;
    }
}
//# sourceMappingURL=parse-annotation.js.map