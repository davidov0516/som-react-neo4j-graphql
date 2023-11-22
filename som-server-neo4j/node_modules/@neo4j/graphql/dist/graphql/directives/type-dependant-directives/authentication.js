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
exports.authenticationDirectiveScaffold = exports.createAuthenticationDirectiveDefinition = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
const static_definitions_1 = require("./static-definitions");
const authenticationDefaultOperations = [
    "READ",
    "AGGREGATE",
    "CREATE",
    "UPDATE",
    "DELETE",
    "CREATE_RELATIONSHIP",
    "DELETE_RELATIONSHIP",
    "SUBSCRIBE",
];
function createAuthentication(jwtPayloadWhere) {
    return new graphql_1.GraphQLDirective({
        name: "authentication",
        locations: [graphql_1.DirectiveLocation.OBJECT, graphql_1.DirectiveLocation.FIELD_DEFINITION, graphql_1.DirectiveLocation.SCHEMA],
        args: {
            operations: {
                description: "operations",
                type: new graphql_1.GraphQLList(static_definitions_1.AUTHENTICATION_OPERATION),
                defaultValue: authenticationDefaultOperations,
            },
            jwt: {
                type: jwtPayloadWhere,
            },
        },
    });
}
function createAuthenticationDirectiveDefinition() {
    const jwtPayloadWhere = new graphql_1.GraphQLInputObjectType({ name: "JWTPayloadWhere", fields: {} });
    const authentication = createAuthentication(jwtPayloadWhere);
    const authenticationAST = (0, utils_1.astFromDirective)(authentication);
    return authenticationAST;
}
exports.createAuthenticationDirectiveDefinition = createAuthenticationDirectiveDefinition;
exports.authenticationDirectiveScaffold = new graphql_1.GraphQLDirective({
    name: "authentication",
    description: "This is a simpler version of the authentication directive to be used in the validate-document step.",
    locations: [graphql_1.DirectiveLocation.OBJECT, graphql_1.DirectiveLocation.FIELD_DEFINITION, graphql_1.DirectiveLocation.SCHEMA],
    args: {
        operations: {
            description: "operations",
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
        },
        jwt: {
            type: graphql_1.GraphQLString,
        },
    },
});
//# sourceMappingURL=authentication.js.map