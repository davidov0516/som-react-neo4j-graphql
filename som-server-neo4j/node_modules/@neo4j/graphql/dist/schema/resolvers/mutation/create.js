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
exports.createResolver = void 0;
const graphql_1 = require("graphql");
const translate_1 = require("../../../translate");
const utils_1 = require("../../../utils");
const get_neo4j_resolve_tree_1 = __importDefault(require("../../../utils/get-neo4j-resolve-tree"));
const publish_events_to_subscription_mechanism_1 = require("../../subscriptions/publish-events-to-subscription-mechanism");
function createResolver({ node, concreteEntityAdapter, }) {
    async function resolve(_root, args, context, info) {
        const resolveTree = (0, get_neo4j_resolve_tree_1.default)(info, { args });
        context.resolveTree = resolveTree;
        const { cypher, params } = await (0, translate_1.translateCreate)({ context: context, node });
        const executeResult = await (0, utils_1.execute)({
            cypher,
            params,
            defaultAccessMode: "WRITE",
            context,
            info,
        });
        (0, publish_events_to_subscription_mechanism_1.publishEventsToSubscriptionMechanism)(executeResult, context.features?.subscriptions, context.schemaModel);
        const nodeProjection = info.fieldNodes[0]?.selectionSet?.selections.find((selection) => selection.kind === graphql_1.Kind.FIELD && selection.name.value === concreteEntityAdapter.plural);
        const resolveResult = {
            info: {
                bookmark: executeResult.bookmark,
                ...executeResult.statistics,
            },
        };
        if (nodeProjection) {
            const nodeKey = nodeProjection?.alias ? nodeProjection.alias.value : nodeProjection?.name?.value;
            resolveResult[nodeKey] = executeResult.records[0]?.data || [];
        }
        return resolveResult;
    }
    return {
        type: `${concreteEntityAdapter.operations.mutationResponseTypeNames.create}!`,
        resolve,
        args: concreteEntityAdapter.operations.createMutationArgumentNames,
    };
}
exports.createResolver = createResolver;
//# sourceMappingURL=create.js.map