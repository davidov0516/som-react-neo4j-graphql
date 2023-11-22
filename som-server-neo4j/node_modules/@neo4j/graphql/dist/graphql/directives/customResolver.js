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
exports.customResolverDirective = void 0;
const graphql_1 = require("graphql");
const SelectionSet_1 = require("../scalars/SelectionSet");
exports.customResolverDirective = new graphql_1.GraphQLDirective({
    name: "customResolver",
    description: "Informs @neo4j/graphql that a field will be resolved by a custom resolver, and allows specification of any field dependencies.",
    locations: [graphql_1.DirectiveLocation.FIELD_DEFINITION],
    args: {
        requires: {
            description: "Selection set of the fields that the custom resolver will depend on. These fields are passed as an object to the first argument of the custom resolver.",
            type: SelectionSet_1.GraphQLSelectionSet,
        },
    },
});
//# sourceMappingURL=customResolver.js.map