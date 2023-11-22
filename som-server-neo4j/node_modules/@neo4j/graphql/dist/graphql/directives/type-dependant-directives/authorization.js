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
exports.authorizationDirectiveScaffold = exports.createAuthorizationDefinitions = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
const static_definitions_1 = require("./static-definitions");
function createAuthorizationWhere(typeDefinitionName, schema, jwtWhere) {
    /**
     * Both inputWhere and JWTPayloadWhere can be undefined,
     * JWTPayload can be not defined by the User in the user document,
     * and unused interface will not generate the {typeDefinitionName}Where making the inputWhere undefined
     * */
    const inputWhere = schema.getType(`${typeDefinitionName}Where`);
    const authorizationWhere = new graphql_1.GraphQLInputObjectType({
        name: `${typeDefinitionName}AuthorizationWhere`,
        fields() {
            return {
                AND: {
                    type: new graphql_1.GraphQLList(authorizationWhere),
                },
                OR: {
                    type: new graphql_1.GraphQLList(authorizationWhere),
                },
                NOT: {
                    type: authorizationWhere,
                },
                ...(inputWhere
                    ? {
                        node: {
                            type: inputWhere,
                        },
                    }
                    : {}),
                jwt: {
                    type: jwtWhere,
                },
            };
        },
    });
    return authorizationWhere;
}
function createAuthorizationFilterRule(typeDefinitionName, inputWhere) {
    return new graphql_1.GraphQLInputObjectType({
        name: `${typeDefinitionName}AuthorizationFilterRule`,
        fields() {
            return {
                operations: {
                    type: new graphql_1.GraphQLList(static_definitions_1.AUTHORIZATION_FILTER_OPERATION),
                    defaultValue: [
                        "READ",
                        "AGGREGATE",
                        "UPDATE",
                        "DELETE",
                        "CREATE_RELATIONSHIP",
                        "DELETE_RELATIONSHIP",
                    ],
                },
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
function createAuthorizationValidateRule(typeDefinitionName, inputWhere) {
    return new graphql_1.GraphQLInputObjectType({
        name: `${typeDefinitionName}AuthorizationValidateRule`,
        fields() {
            return {
                operations: {
                    type: new graphql_1.GraphQLList(static_definitions_1.AUTHORIZATION_VALIDATE_OPERATION),
                    defaultValue: [
                        "READ",
                        "AGGREGATE",
                        "CREATE",
                        "UPDATE",
                        "DELETE",
                        "CREATE_RELATIONSHIP",
                        "DELETE_RELATIONSHIP",
                    ],
                },
                when: {
                    type: new graphql_1.GraphQLList(static_definitions_1.AUTHORIZATION_VALIDATE_STAGE),
                    defaultValue: ["BEFORE", "AFTER"],
                },
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
function createAuthorization({ typeDefinitionName, filterRule, validateRule, }) {
    return new graphql_1.GraphQLDirective({
        name: `${typeDefinitionName}Authorization`,
        locations: [graphql_1.DirectiveLocation.OBJECT, graphql_1.DirectiveLocation.FIELD_DEFINITION],
        args: {
            filter: {
                description: "filter",
                type: new graphql_1.GraphQLList(filterRule),
            },
            validate: {
                description: "validate",
                type: new graphql_1.GraphQLList(validateRule),
            },
        },
    });
}
function createAuthorizationDefinitions(typeDefinitionName, schema) {
    const jwtWhere = new graphql_1.GraphQLInputObjectType({ name: "JWTPayloadWhere", fields: {} });
    const authorizationWhere = createAuthorizationWhere(typeDefinitionName, schema, jwtWhere);
    const authorizationFilterRule = createAuthorizationFilterRule(typeDefinitionName, authorizationWhere);
    const authorizationValidateRule = createAuthorizationValidateRule(typeDefinitionName, authorizationWhere);
    const authorization = createAuthorization({
        typeDefinitionName,
        filterRule: authorizationFilterRule,
        validateRule: authorizationValidateRule,
    });
    const authorizationSchema = new graphql_1.GraphQLSchema({
        directives: [authorization],
        types: [authorizationWhere, authorizationFilterRule, authorizationValidateRule],
    });
    const authorizationWhereAST = (0, utils_1.astFromInputObjectType)(authorizationWhere, authorizationSchema);
    const authorizationFilterRuleAST = (0, utils_1.astFromInputObjectType)(authorizationFilterRule, authorizationSchema);
    const authorizationValidateRuleAST = (0, utils_1.astFromInputObjectType)(authorizationValidateRule, authorizationSchema);
    const authorizationAST = (0, utils_1.astFromDirective)(authorization);
    return [authorizationWhereAST, authorizationFilterRuleAST, authorizationValidateRuleAST, authorizationAST];
}
exports.createAuthorizationDefinitions = createAuthorizationDefinitions;
exports.authorizationDirectiveScaffold = new graphql_1.GraphQLDirective({
    name: `authorization`,
    description: "This is a simpler version of the authorization directive to be used in the validate-document step.",
    locations: [graphql_1.DirectiveLocation.OBJECT, graphql_1.DirectiveLocation.FIELD_DEFINITION],
    args: {
        filter: {
            description: "filter",
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
        },
        validate: {
            description: "validate",
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
        },
    },
});
//# sourceMappingURL=authorization.js.map