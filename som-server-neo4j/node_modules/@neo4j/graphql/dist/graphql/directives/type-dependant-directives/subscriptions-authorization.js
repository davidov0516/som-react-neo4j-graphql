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
exports.subscriptionsAuthorizationDirectiveScaffold = exports.createSubscriptionsAuthorizationDefinitions = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
function createSubscriptionsAuthorizationWhere(typeDefinitionName, schema, jwtPayloadWhere) {
    /**
     * Both inputWhere and JWTPayloadWhere can be undefined,
     * JWTPayload can be not defined by the User in the user document,
     * and unused interface will not generate the {typeDefinitionName}Where making the inputWhere undefined
     * */
    const nodeWhere = schema.getType(`${typeDefinitionName}SubscriptionWhere`);
    const relationshipWhere = schema.getType(`${typeDefinitionName}RelationshipsSubscriptionWhere`);
    const subscriptionsAuthorizationWhere = new graphql_1.GraphQLInputObjectType({
        name: `${typeDefinitionName}SubscriptionsAuthorizationWhere`,
        fields() {
            return {
                AND: {
                    type: new graphql_1.GraphQLList(subscriptionsAuthorizationWhere),
                },
                OR: {
                    type: new graphql_1.GraphQLList(subscriptionsAuthorizationWhere),
                },
                NOT: {
                    type: subscriptionsAuthorizationWhere,
                },
                ...(nodeWhere
                    ? {
                        node: {
                            type: nodeWhere,
                        },
                    }
                    : {}),
                ...(relationshipWhere
                    ? {
                        relationship: {
                            type: relationshipWhere,
                        },
                    }
                    : {}),
                jwt: {
                    type: jwtPayloadWhere,
                },
            };
        },
    });
    return subscriptionsAuthorizationWhere;
}
function createSubscriptionsAuthorizationFilterRule(typeDefinitionName, inputWhere) {
    return new graphql_1.GraphQLInputObjectType({
        name: `${typeDefinitionName}SubscriptionsAuthorizationFilterRule`,
        fields() {
            return {
                requireAuthentication: {
                    type: graphql_1.GraphQLBoolean,
                    defaultValue: true,
                },
                where: {
                    type: inputWhere,
                },
            };
        },
    });
}
function createSubscriptionsAuthorization({ typeDefinitionName, filterRule, }) {
    return new graphql_1.GraphQLDirective({
        name: `${typeDefinitionName}SubscriptionsAuthorization`,
        locations: [graphql_1.DirectiveLocation.OBJECT, graphql_1.DirectiveLocation.FIELD_DEFINITION],
        args: {
            filter: {
                description: "filter",
                type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(filterRule)),
            },
        },
    });
}
function createSubscriptionsAuthorizationDefinitions(typeDefinitionName, schema) {
    const jwtPayloadWhere = new graphql_1.GraphQLInputObjectType({ name: "JWTPayloadWhere", fields: {} });
    const subscriptionsAuthorizationWhere = createSubscriptionsAuthorizationWhere(typeDefinitionName, schema, jwtPayloadWhere);
    const subscriptionsAuthorizationFilterRule = createSubscriptionsAuthorizationFilterRule(typeDefinitionName, subscriptionsAuthorizationWhere);
    const subscriptionsAuthorization = createSubscriptionsAuthorization({
        typeDefinitionName,
        filterRule: subscriptionsAuthorizationFilterRule,
    });
    const subscriptionsAuthorizationSchema = new graphql_1.GraphQLSchema({
        directives: [subscriptionsAuthorization],
        types: [subscriptionsAuthorizationWhere, subscriptionsAuthorizationFilterRule],
    });
    const subscriptionsAuthorizationWhereAST = (0, utils_1.astFromInputObjectType)(subscriptionsAuthorizationWhere, subscriptionsAuthorizationSchema);
    const subscriptionsAuthorizationFilterRuleAST = (0, utils_1.astFromInputObjectType)(subscriptionsAuthorizationFilterRule, subscriptionsAuthorizationSchema);
    const subscriptionsAuthorizationAST = (0, utils_1.astFromDirective)(subscriptionsAuthorization);
    return [subscriptionsAuthorizationWhereAST, subscriptionsAuthorizationFilterRuleAST, subscriptionsAuthorizationAST];
}
exports.createSubscriptionsAuthorizationDefinitions = createSubscriptionsAuthorizationDefinitions;
exports.subscriptionsAuthorizationDirectiveScaffold = new graphql_1.GraphQLDirective({
    name: `subscriptionsAuthorization`,
    description: "This is a simpler version of the subscriptionsAuthorization directive to be used in the validate-document step.",
    locations: [graphql_1.DirectiveLocation.OBJECT, graphql_1.DirectiveLocation.FIELD_DEFINITION],
    args: {
        filter: {
            description: "filter",
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLString)),
        },
    },
});
//# sourceMappingURL=subscriptions-authorization.js.map