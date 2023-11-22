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
exports.relayIdDirective = void 0;
const graphql_1 = require("graphql");
exports.relayIdDirective = new graphql_1.GraphQLDirective({
    name: "relayId",
    description: "Mark the field to be used as the global node identifier for Relay. This field will be backed by a unique node property constraint.",
    locations: [graphql_1.DirectiveLocation.FIELD_DEFINITION],
});
//# sourceMappingURL=relay-id.js.map