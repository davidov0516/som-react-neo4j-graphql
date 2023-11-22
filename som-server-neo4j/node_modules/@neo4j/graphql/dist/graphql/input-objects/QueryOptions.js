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
exports.QueryOptions = void 0;
const graphql_1 = require("graphql");
exports.QueryOptions = new graphql_1.GraphQLInputObjectType({
    name: "QueryOptions",
    description: "Input type for options that can be specified on a query operation.",
    fields: {
        offset: {
            type: graphql_1.GraphQLInt,
        },
        limit: {
            type: graphql_1.GraphQLInt,
        },
    },
});
//# sourceMappingURL=QueryOptions.js.map