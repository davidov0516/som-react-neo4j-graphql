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
exports.uniqueDirective = void 0;
const graphql_1 = require("graphql");
exports.uniqueDirective = new graphql_1.GraphQLDirective({
    name: "unique",
    description: "Informs @neo4j/graphql that there should be a uniqueness constraint in the database for the decorated field.",
    locations: [graphql_1.DirectiveLocation.FIELD_DEFINITION],
    args: {
        constraintName: {
            description: "The name which should be used for this constraint. By default; type name, followed by an underscore, followed by the field name.",
            type: graphql_1.GraphQLString,
        },
    },
});
//# sourceMappingURL=unique.js.map