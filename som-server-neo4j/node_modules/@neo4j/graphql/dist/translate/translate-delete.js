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
exports.translateDelete = void 0;
const constants_1 = require("../constants");
const create_delete_and_params_1 = __importDefault(require("./create-delete-and-params"));
const translate_top_level_match_1 = require("./translate-top-level-match");
const create_event_meta_1 = require("./subscriptions/create-event-meta");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_connection_event_meta_1 = require("./subscriptions/create-connection-event-meta");
const check_authentication_1 = require("./authorization/check-authentication");
function translateDelete({ context, node, }) {
    const { resolveTree } = context;
    const deleteInput = resolveTree.args.delete;
    const varName = "this";
    let matchAndWhereStr = "";
    let deleteStr = "";
    let cypherParams = {};
    const withVars = [varName];
    if (context.subscriptionsEnabled) {
        withVars.push(constants_1.META_CYPHER_VARIABLE);
    }
    const where = resolveTree.args.where;
    const matchNode = new cypher_builder_1.default.NamedNode(varName, { labels: node.getLabels(context) });
    const topLevelMatch = (0, translate_top_level_match_1.translateTopLevelMatch)({ matchNode, node, context, operation: "DELETE", where });
    matchAndWhereStr = topLevelMatch.cypher;
    cypherParams = { ...cypherParams, ...topLevelMatch.params };
    if (deleteInput) {
        const deleteAndParams = (0, create_delete_and_params_1.default)({
            context,
            node,
            deleteInput,
            varName,
            parentVar: varName,
            withVars,
            parameterPrefix: `${varName}_${resolveTree.name}.args.delete`,
        });
        [deleteStr] = deleteAndParams;
        cypherParams = {
            ...cypherParams,
            ...(deleteStr.includes(resolveTree.name)
                ? { [`${varName}_${resolveTree.name}`]: { args: { delete: deleteInput } } }
                : {}),
            ...deleteAndParams[1],
        };
    }
    else {
        (0, check_authentication_1.checkAuthentication)({ context, node, targetOperations: ["DELETE"] });
    }
    if (context.subscriptionsEnabled && !deleteInput) {
        deleteStr = findConnectedNodesCypherQuery(varName);
    }
    const deleteQuery = new cypher_builder_1.default.RawCypher(() => {
        const eventMeta = (0, create_event_meta_1.createEventMeta)({ event: "delete", nodeVariable: varName, typename: node.name });
        const cypher = [
            ...(context.subscriptionsEnabled ? [`WITH [] AS ${constants_1.META_CYPHER_VARIABLE}`] : []),
            matchAndWhereStr,
            ...(context.subscriptionsEnabled ? [`WITH ${varName}, ${eventMeta}`] : []),
            deleteStr,
            `DETACH DELETE ${varName}`,
            ...getDeleteReturn(context),
        ];
        return [cypher.filter(Boolean).join("\n"), cypherParams];
    });
    const result = deleteQuery.build(varName);
    return result;
}
exports.translateDelete = translateDelete;
function getDeleteReturn(context) {
    return context.subscriptionsEnabled
        ? [
            `WITH collect(${constants_1.META_CYPHER_VARIABLE}) AS ${constants_1.META_CYPHER_VARIABLE}`,
            `WITH REDUCE(m=[], n IN ${constants_1.META_CYPHER_VARIABLE} | m + n) AS ${constants_1.META_CYPHER_VARIABLE}`,
            `RETURN ${constants_1.META_CYPHER_VARIABLE}`,
        ]
        : [];
}
function findConnectedNodesCypherQuery(varName) {
    return [
        `CALL {`,
        `\tWITH ${varName}`,
        `\tOPTIONAL MATCH (${varName})-[r]-()`,
        `\tWITH ${varName}, collect(DISTINCT r) AS relationships_to_delete`,
        `\tUNWIND relationships_to_delete AS x`,
        `\tWITH CASE`,
        `\t\tWHEN id(${varName})=id(startNode(x)) THEN ${createDisconnectEventMetaForDeletedNode({
            relVariable: "x",
            fromVariable: varName,
            toVariable: "endNode(x)",
        })}`,
        `\t\tWHEN id(${varName})=id(endNode(x)) THEN ${createDisconnectEventMetaForDeletedNode({
            relVariable: "x",
            fromVariable: "startNode(x)",
            toVariable: varName,
        })}`,
        `\tEND AS meta`,
        `\tRETURN collect(DISTINCT meta) AS relationship_meta`,
        `}`,
        `WITH REDUCE(m=meta, r IN relationship_meta | m + r) AS meta, ${varName}`,
    ].join("\n");
}
function createDisconnectEventMetaForDeletedNode({ relVariable, fromVariable, toVariable }) {
    return (0, create_connection_event_meta_1.createConnectionEventMetaObject)({
        event: "delete_relationship",
        relVariable,
        fromVariable,
        toVariable,
        typename: `type(${relVariable})`,
        fromLabels: `labels(${fromVariable})`,
        toLabels: `labels(${toVariable})`,
        toProperties: `properties(${toVariable})`,
        fromProperties: `properties(${fromVariable})`,
    });
}
//# sourceMappingURL=translate-delete.js.map