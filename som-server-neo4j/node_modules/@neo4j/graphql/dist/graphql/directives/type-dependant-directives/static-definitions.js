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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaticAuthorizationDefinitions = exports.AUTHENTICATION_OPERATION = exports.AUTHORIZATION_FILTER_OPERATION = exports.AUTHORIZATION_VALIDATE_OPERATION = exports.AUTHORIZATION_VALIDATE_STAGE = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
const graphql_compose_1 = require("graphql-compose");
const get_where_fields_1 = __importDefault(require("../../../schema/get-where-fields"));
const jwt_payload_1 = require("./jwt-payload");
exports.AUTHORIZATION_VALIDATE_STAGE = new graphql_1.GraphQLEnumType({
    name: "AuthorizationValidateStage",
    values: { BEFORE: { value: "BEFORE" }, AFTER: { value: "AFTER" } },
});
exports.AUTHORIZATION_VALIDATE_OPERATION = new graphql_1.GraphQLEnumType({
    name: "AuthorizationValidateOperation",
    values: {
        CREATE: { value: "CREATE" },
        READ: { value: "READ" },
        AGGREGATE: { value: "AGGREGATE" },
        UPDATE: { value: "UPDATE" },
        DELETE: { value: "DELETE" },
        CREATE_RELATIONSHIP: { value: "CREATE_RELATIONSHIP" },
        DELETE_RELATIONSHIP: { value: "DELETE_RELATIONSHIP" },
    },
});
exports.AUTHORIZATION_FILTER_OPERATION = new graphql_1.GraphQLEnumType({
    name: "AuthorizationFilterOperation",
    values: {
        READ: { value: "READ" },
        AGGREGATE: { value: "AGGREGATE" },
        UPDATE: { value: "UPDATE" },
        DELETE: { value: "DELETE" },
        CREATE_RELATIONSHIP: { value: "CREATE_RELATIONSHIP" },
        DELETE_RELATIONSHIP: { value: "DELETE_RELATIONSHIP" },
    },
});
exports.AUTHENTICATION_OPERATION = new graphql_1.GraphQLEnumType({
    name: "AuthenticationOperation",
    values: {
        CREATE: { value: "CREATE" },
        READ: { value: "READ" },
        AGGREGATE: { value: "AGGREGATE" },
        UPDATE: { value: "UPDATE" },
        DELETE: { value: "DELETE" },
        CREATE_RELATIONSHIP: { value: "CREATE_RELATIONSHIP" },
        DELETE_RELATIONSHIP: { value: "DELETE_RELATIONSHIP" },
        SUBSCRIBE: { value: "SUBSCRIBE" },
    },
});
function getStaticAuthorizationDefinitions(JWTPayloadDefinition) {
    const schema = new graphql_1.GraphQLSchema({});
    const authorizationValidateStage = (0, utils_1.astFromEnumType)(exports.AUTHORIZATION_VALIDATE_STAGE, schema);
    const authorizationValidateOperation = (0, utils_1.astFromEnumType)(exports.AUTHORIZATION_VALIDATE_OPERATION, schema);
    const authorizationFilterOperation = (0, utils_1.astFromEnumType)(exports.AUTHORIZATION_FILTER_OPERATION, schema);
    const authenticationOperation = (0, utils_1.astFromEnumType)(exports.AUTHENTICATION_OPERATION, schema);
    const ASTs = [
        authorizationValidateStage,
        authorizationValidateOperation,
        authorizationFilterOperation,
        authenticationOperation,
    ];
    const JWTPayloadWhere = createJWTPayloadWhere(schema, JWTPayloadDefinition);
    const JWTPayloadWhereAST = (0, utils_1.astFromInputObjectType)(JWTPayloadWhere, schema);
    ASTs.push(JWTPayloadWhereAST);
    return ASTs;
}
exports.getStaticAuthorizationDefinitions = getStaticAuthorizationDefinitions;
function createJWTPayloadWhere(schema, JWTPayloadDefinition) {
    const inputFieldsType = (0, get_where_fields_1.default)({
        typeName: "JWTPayload",
        fields: (0, jwt_payload_1.getJwtFields)(schema, JWTPayloadDefinition),
    });
    const composer = new graphql_compose_1.SchemaComposer();
    const inputTC = composer.createInputTC({
        name: "JWTPayloadWhere",
        fields: inputFieldsType,
    });
    return inputTC.getType();
}
//# sourceMappingURL=static-definitions.js.map