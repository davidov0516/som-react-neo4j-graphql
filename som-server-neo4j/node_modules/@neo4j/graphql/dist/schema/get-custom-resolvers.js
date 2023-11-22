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
const graphql_1 = require("graphql");
const is_root_type_1 = require("../utils/is-root-type");
function getCustomResolvers(document) {
    const customResolvers = (document.definitions || []).reduce((res, definition) => {
        if (definition.kind !== graphql_1.Kind.OBJECT_TYPE_DEFINITION) {
            return res;
        }
        if (!(0, is_root_type_1.isRootType)(definition)) {
            return res;
        }
        const cypherOnes = (definition.fields || []).filter((field) => field.directives && field.directives.find((direc) => direc.name.value === "cypher"));
        const normalOnes = (definition.fields || []).filter((field) => (field.directives && !field.directives.find((direc) => direc.name.value === "cypher")) ||
            !field.directives);
        if (definition.name.value === "Query") {
            if (cypherOnes.length) {
                res.customCypherQuery = {
                    ...definition,
                    fields: cypherOnes,
                };
            }
            if (normalOnes.length) {
                res.customQuery = {
                    ...definition,
                    fields: normalOnes,
                };
            }
        }
        if (definition.name.value === "Mutation") {
            if (cypherOnes.length) {
                res.customCypherMutation = {
                    ...definition,
                    fields: cypherOnes,
                };
            }
            if (normalOnes.length) {
                res.customMutation = {
                    ...definition,
                    fields: normalOnes,
                };
            }
        }
        if (definition.name.value === "Subscription") {
            if (normalOnes.length) {
                res.customSubscription = {
                    ...definition,
                    fields: normalOnes,
                };
            }
        }
        return res;
    }, {});
    return customResolvers;
}
exports.default = getCustomResolvers;
//# sourceMappingURL=get-custom-resolvers.js.map