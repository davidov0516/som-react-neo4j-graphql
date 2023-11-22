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
exports.jwtClaim = void 0;
const graphql_1 = require("graphql");
exports.jwtClaim = new graphql_1.GraphQLDirective({
    name: "jwtClaim",
    description: "Instructs @neo4j/graphql that the flagged field has a mapped path within the JWT Payload.",
    locations: [graphql_1.DirectiveLocation.FIELD_DEFINITION],
    args: {
        path: {
            description: "The path of the field in the real JWT as mapped within the JWT Payload.",
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
        },
    },
});
//# sourceMappingURL=jwt-claim.js.map