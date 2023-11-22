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
exports.fulltextDirective = exports.SCORE_FIELD = void 0;
const graphql_1 = require("graphql");
const deprecationReason = "The name argument has been deprecated and will be removed in future versions " +
    "Please use indexName instead. More information about the changes to @fulltext can be found at " +
    "https://neo4j.com/docs/graphql-manual/current/guides/v4-migration/#_fulltext_changes.";
exports.SCORE_FIELD = "score";
exports.fulltextDirective = new graphql_1.GraphQLDirective({
    name: "fulltext",
    description: "Informs @neo4j/graphql that there should be a fulltext index in the database, allows users to search by the index in the generated schema.",
    args: {
        indexes: {
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(new graphql_1.GraphQLInputObjectType({
                name: "FullTextInput",
                fields: {
                    name: {
                        deprecationReason,
                        type: graphql_1.GraphQLString,
                    },
                    fields: {
                        type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLString)),
                    },
                    queryName: {
                        type: graphql_1.GraphQLString,
                    },
                    indexName: {
                        type: graphql_1.GraphQLString,
                    },
                },
            }))),
        },
    },
    locations: [graphql_1.DirectiveLocation.OBJECT],
});
//# sourceMappingURL=fulltext.js.map