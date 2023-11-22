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
exports.CartesianPointDistance = void 0;
const graphql_1 = require("graphql");
const CartesianPointInput_1 = require("./CartesianPointInput");
exports.CartesianPointDistance = new graphql_1.GraphQLInputObjectType({
    name: "CartesianPointDistance",
    description: "Input type for a cartesian point with a distance",
    fields: {
        point: {
            type: new graphql_1.GraphQLNonNull(CartesianPointInput_1.CartesianPointInput),
        },
        distance: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat),
        },
    },
});
//# sourceMappingURL=CartesianPointDistance.js.map