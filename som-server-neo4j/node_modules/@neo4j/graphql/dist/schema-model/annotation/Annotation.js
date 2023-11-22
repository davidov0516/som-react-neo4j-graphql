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
exports.annotationToKey = exports.AnnotationsKey = void 0;
const AuthenticationAnnotation_1 = require("./AuthenticationAnnotation");
const AuthorizationAnnotation_1 = require("./AuthorizationAnnotation");
const CoalesceAnnotation_1 = require("./CoalesceAnnotation");
const CustomResolverAnnotation_1 = require("./CustomResolverAnnotation");
const CypherAnnotation_1 = require("./CypherAnnotation");
const DefaultAnnotation_1 = require("./DefaultAnnotation");
const FilterableAnnotation_1 = require("./FilterableAnnotation");
const FullTextAnnotation_1 = require("./FullTextAnnotation");
const IDAnnotation_1 = require("./IDAnnotation");
const JWTClaimAnnotation_1 = require("./JWTClaimAnnotation");
const JWTPayloadAnnotation_1 = require("./JWTPayloadAnnotation");
const KeyAnnotation_1 = require("./KeyAnnotation");
const LimitAnnotation_1 = require("./LimitAnnotation");
const MutationAnnotation_1 = require("./MutationAnnotation");
const PluralAnnotation_1 = require("./PluralAnnotation");
const PopulatedByAnnotation_1 = require("./PopulatedByAnnotation");
const PrivateAnnotation_1 = require("./PrivateAnnotation");
const QueryAnnotation_1 = require("./QueryAnnotation");
const RelayIDAnnotation_1 = require("./RelayIDAnnotation");
const SelectableAnnotation_1 = require("./SelectableAnnotation");
const SettableAnnotation_1 = require("./SettableAnnotation");
const SubscriptionAnnotation_1 = require("./SubscriptionAnnotation");
const SubscriptionsAuthorizationAnnotation_1 = require("./SubscriptionsAuthorizationAnnotation");
const TimestampAnnotation_1 = require("./TimestampAnnotation");
const UniqueAnnotation_1 = require("./UniqueAnnotation");
var AnnotationsKey;
(function (AnnotationsKey) {
    AnnotationsKey["authentication"] = "authentication";
    AnnotationsKey["authorization"] = "authorization";
    AnnotationsKey["coalesce"] = "coalesce";
    AnnotationsKey["customResolver"] = "customResolver";
    AnnotationsKey["cypher"] = "cypher";
    AnnotationsKey["default"] = "default";
    AnnotationsKey["filterable"] = "filterable";
    AnnotationsKey["fulltext"] = "fulltext";
    AnnotationsKey["id"] = "id";
    AnnotationsKey["jwtClaim"] = "jwtClaim";
    AnnotationsKey["jwtPayload"] = "jwtPayload";
    AnnotationsKey["key"] = "key";
    AnnotationsKey["limit"] = "limit";
    AnnotationsKey["mutation"] = "mutation";
    AnnotationsKey["plural"] = "plural";
    AnnotationsKey["populatedBy"] = "populatedBy";
    AnnotationsKey["private"] = "private";
    AnnotationsKey["query"] = "query";
    AnnotationsKey["selectable"] = "selectable";
    AnnotationsKey["settable"] = "settable";
    AnnotationsKey["subscription"] = "subscription";
    AnnotationsKey["subscriptionsAuthorization"] = "subscriptionsAuthorization";
    AnnotationsKey["timestamp"] = "timestamp";
    AnnotationsKey["unique"] = "unique";
    AnnotationsKey["relayId"] = "relayId";
})(AnnotationsKey || (exports.AnnotationsKey = AnnotationsKey = {}));
function annotationToKey(ann) {
    if (ann instanceof CypherAnnotation_1.CypherAnnotation)
        return AnnotationsKey.cypher;
    if (ann instanceof AuthorizationAnnotation_1.AuthorizationAnnotation)
        return AnnotationsKey.authorization;
    if (ann instanceof AuthenticationAnnotation_1.AuthenticationAnnotation)
        return AnnotationsKey.authentication;
    if (ann instanceof KeyAnnotation_1.KeyAnnotation)
        return AnnotationsKey.key;
    if (ann instanceof SubscriptionsAuthorizationAnnotation_1.SubscriptionsAuthorizationAnnotation)
        return AnnotationsKey.subscriptionsAuthorization;
    if (ann instanceof LimitAnnotation_1.LimitAnnotation)
        return AnnotationsKey.limit;
    if (ann instanceof DefaultAnnotation_1.DefaultAnnotation)
        return AnnotationsKey.default;
    if (ann instanceof CoalesceAnnotation_1.CoalesceAnnotation)
        return AnnotationsKey.coalesce;
    if (ann instanceof CustomResolverAnnotation_1.CustomResolverAnnotation)
        return AnnotationsKey.customResolver;
    if (ann instanceof IDAnnotation_1.IDAnnotation)
        return AnnotationsKey.id;
    if (ann instanceof MutationAnnotation_1.MutationAnnotation)
        return AnnotationsKey.mutation;
    if (ann instanceof PluralAnnotation_1.PluralAnnotation)
        return AnnotationsKey.plural;
    if (ann instanceof FilterableAnnotation_1.FilterableAnnotation)
        return AnnotationsKey.filterable;
    if (ann instanceof FullTextAnnotation_1.FullTextAnnotation)
        return AnnotationsKey.fulltext;
    if (ann instanceof PopulatedByAnnotation_1.PopulatedByAnnotation)
        return AnnotationsKey.populatedBy;
    if (ann instanceof QueryAnnotation_1.QueryAnnotation)
        return AnnotationsKey.query;
    if (ann instanceof PrivateAnnotation_1.PrivateAnnotation)
        return AnnotationsKey.private;
    if (ann instanceof SelectableAnnotation_1.SelectableAnnotation)
        return AnnotationsKey.selectable;
    if (ann instanceof SettableAnnotation_1.SettableAnnotation)
        return AnnotationsKey.settable;
    if (ann instanceof TimestampAnnotation_1.TimestampAnnotation)
        return AnnotationsKey.timestamp;
    if (ann instanceof UniqueAnnotation_1.UniqueAnnotation)
        return AnnotationsKey.unique;
    if (ann instanceof SubscriptionAnnotation_1.SubscriptionAnnotation)
        return AnnotationsKey.subscription;
    if (ann instanceof JWTClaimAnnotation_1.JWTClaimAnnotation)
        return AnnotationsKey.jwtClaim;
    if (ann instanceof JWTPayloadAnnotation_1.JWTPayloadAnnotation)
        return AnnotationsKey.jwtPayload;
    if (ann instanceof RelayIDAnnotation_1.RelayIDAnnotation)
        return AnnotationsKey.relayId;
    throw new Error("annotation not known");
}
exports.annotationToKey = annotationToKey;
//# sourceMappingURL=Annotation.js.map