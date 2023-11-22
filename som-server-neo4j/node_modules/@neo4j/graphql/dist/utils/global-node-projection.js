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
exports.addGlobalIdField = void 0;
const graphql_compose_1 = require("graphql-compose");
function createProjection(globalIdField) {
    return {
        alias: globalIdField,
        args: {},
        fieldsByTypeName: {},
        name: globalIdField,
    };
}
function addGlobalIdField(ogProjection, globalIdField) {
    const alreadyProjected = Object.values(ogProjection).find((x) => x.name === globalIdField);
    // if the db field has not been projected, we need to add it to the projection
    const projection = alreadyProjected
        ? { ...ogProjection }
        : { ...ogProjection, [globalIdField]: createProjection(globalIdField) };
    // if the projection has the id field, but the globalIdField is not "id" we delete it
    return globalIdField !== "id" ? (0, graphql_compose_1.omit)(projection, "id") : projection;
}
exports.addGlobalIdField = addGlobalIdField;
//# sourceMappingURL=global-node-projection.js.map