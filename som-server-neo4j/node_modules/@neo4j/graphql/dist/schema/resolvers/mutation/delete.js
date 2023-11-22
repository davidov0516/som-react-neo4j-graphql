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
exports.deleteResolver = void 0;
const translate_1 = require("../../../translate");
const utils_1 = require("../../../utils");
const get_neo4j_resolve_tree_1 = __importDefault(require("../../../utils/get-neo4j-resolve-tree"));
const publish_events_to_subscription_mechanism_1 = require("../../subscriptions/publish-events-to-subscription-mechanism");
function deleteResolver({ node, composer, concreteEntityAdapter, }) {
    async function resolve(_root, args, context, info) {
        const resolveTree = (0, get_neo4j_resolve_tree_1.default)(info, { args });
        context.resolveTree = resolveTree;
        const { cypher, params } = (0, translate_1.translateDelete)({ context: context, node });
        const executeResult = await (0, utils_1.execute)({
            cypher,
            params,
            defaultAccessMode: "WRITE",
            context,
            info,
        });
        (0, publish_events_to_subscription_mechanism_1.publishEventsToSubscriptionMechanism)(executeResult, context.features?.subscriptions, context.schemaModel);
        return { bookmark: executeResult.bookmark, ...executeResult.statistics };
    }
    const hasDeleteInput = composer.has(concreteEntityAdapter.operations.deleteInputTypeName);
    return {
        type: `DeleteInfo!`,
        resolve,
        args: {
            where: concreteEntityAdapter.operations.whereInputTypeName,
            ...(hasDeleteInput
                ? {
                    delete: concreteEntityAdapter.operations.deleteInputTypeName,
                }
                : {}),
        },
    };
}
exports.deleteResolver = deleteResolver;
//# sourceMappingURL=delete.js.map