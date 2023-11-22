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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cypherResolver = void 0;
const translate_1 = require("../../../translate");
const utils_1 = require("../../../utils");
const get_neo4j_resolve_tree_1 = __importDefault(require("../../../utils/get-neo4j-resolve-tree"));
const utils_2 = require("../../../utils/utils");
const to_compose_1 = require("../../to-compose");
function cypherResolver({ field, attributeAdapter, type, }) {
    async function resolve(_root, args, context, info) {
        const resolveTree = (0, get_neo4j_resolve_tree_1.default)(info);
        const statement = attributeAdapter.annotations.cypher?.statement; // this is known because of how we get here
        context.resolveTree = resolveTree;
        const { cypher, params } = (0, translate_1.translateTopLevelCypher)({
            context: context,
            field,
            args,
            type,
            statement,
        });
        const executeResult = await (0, utils_1.execute)({
            cypher,
            params,
            defaultAccessMode: type === "Query" ? "READ" : "WRITE",
            context,
            info,
        });
        const values = executeResult.result.records.map((record) => {
            const value = record.get(0);
            if (["number", "string", "boolean"].includes(typeof value)) {
                return value;
            }
            if (!value) {
                return undefined;
            }
            if ((0, utils_2.isNeoInt)(value)) {
                return Number(value);
            }
            if (value.identity && value.labels && value.properties) {
                return value.properties;
            }
            return value;
        });
        if (!attributeAdapter.typeHelper.isList()) {
            return values[0];
        }
        return values;
    }
    return {
        type: attributeAdapter.getTypePrettyName(),
        resolve,
        args: (0, to_compose_1.graphqlArgsToCompose)(attributeAdapter.args),
    };
}
exports.cypherResolver = cypherResolver;
//# sourceMappingURL=cypher.js.map