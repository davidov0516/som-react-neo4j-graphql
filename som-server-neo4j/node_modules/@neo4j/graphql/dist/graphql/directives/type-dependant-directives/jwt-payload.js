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
exports.getStandardJwtDefinition = exports.getJwtFields = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
const get_obj_field_meta_1 = __importDefault(require("../../../schema/get-obj-field-meta"));
function getJwtFields(schema, JWTPayloadDefinition) {
    if (JWTPayloadDefinition) {
        const fields = (0, get_obj_field_meta_1.default)({
            obj: JWTPayloadDefinition,
            objects: [],
            interfaces: [],
            unions: [],
            scalars: [],
            enums: [],
        });
        const standardTypeDefinition = getStandardJwtDefinition(schema);
        const standardJwtFields = (0, get_obj_field_meta_1.default)({
            obj: standardTypeDefinition,
            objects: [],
            interfaces: [],
            unions: [],
            scalars: [],
            enums: [],
        });
        fields.primitiveFields.push(...standardJwtFields.primitiveFields);
        return fields;
    }
    return {
        scalarFields: [],
        primitiveFields: [],
        enumFields: [],
        temporalFields: [],
        pointFields: [],
    };
}
exports.getJwtFields = getJwtFields;
function getStandardJwtDefinition(schema) {
    const jwtStandardType = new graphql_1.GraphQLObjectType({
        name: "JWTStandard",
        fields: {
            iss: {
                type: graphql_1.GraphQLString,
                description: "A case-sensitive string containing a StringOrURI value that identifies the principal that issued the JWT.",
            },
            sub: {
                type: graphql_1.GraphQLString,
                description: "A case-sensitive string containing a StringOrURI value that identifies the principal that is the subject of the JWT.",
            },
            aud: {
                type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
                description: "An array of case-sensitive strings, each containing a StringOrURI value that identifies the recipients that can process the JWT.",
            },
            exp: {
                type: graphql_1.GraphQLInt,
                description: "Identifies the expiration time on or after which the JWT must not be accepted for processing.",
            },
            nbf: {
                type: graphql_1.GraphQLInt,
                description: "Identifies the time before which the JWT must not be accepted for processing.",
            },
            iat: {
                type: graphql_1.GraphQLInt,
                description: "Identifies the time at which the JWT was issued, to determine the age of the JWT.",
            },
            jti: {
                type: graphql_1.GraphQLString,
                description: "Uniquely identifies the JWT, to prevent the JWT from being replayed.",
            },
        },
    });
    return (0, utils_1.astFromObjectType)(jwtStandardType, schema);
}
exports.getStandardJwtDefinition = getStandardJwtDefinition;
//# sourceMappingURL=jwt-payload.js.map