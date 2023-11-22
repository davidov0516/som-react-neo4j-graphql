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
exports.populatedByDirective = void 0;
const graphql_1 = require("graphql");
const PopulatedByOperation_1 = require("./arguments/enums/PopulatedByOperation");
exports.populatedByDirective = new graphql_1.GraphQLDirective({
    name: "populatedBy",
    description: "Instructs @neo4j/graphql to invoke the specified callback function when updating or creating the properties on a node or relationship.",
    locations: [graphql_1.DirectiveLocation.FIELD_DEFINITION],
    args: {
        callback: {
            description: "The name of the callback function that will be used to populate the fields values.",
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
        },
        operations: {
            description: "Which events to invoke the callback on.",
            defaultValue: PopulatedByOperation_1.PopulatedByOperationEnum.getValues().map((v) => v.value),
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(PopulatedByOperation_1.PopulatedByOperationEnum))),
        },
    },
});
//# sourceMappingURL=populatedBy.js.map