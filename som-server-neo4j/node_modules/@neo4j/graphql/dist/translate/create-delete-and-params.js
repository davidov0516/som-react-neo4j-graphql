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
const create_connection_where_and_params_1 = __importDefault(require("./where/create-connection-where-and-params"));
const constants_1 = require("../constants");
const create_event_meta_1 = require("./subscriptions/create-event-meta");
const create_connection_event_meta_1 = require("./subscriptions/create-connection-event-meta");
const filter_meta_variable_1 = require("./subscriptions/filter-meta-variable");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const case_where_1 = require("../utils/case-where");
const create_authorization_before_and_params_1 = require("./authorization/compatibility/create-authorization-before-and-params");
const check_authentication_1 = require("./authorization/check-authentication");
function createDeleteAndParams({ deleteInput, varName, node, parentVar, chainStr, withVars, context, parameterPrefix, recursing, }) {
    (0, check_authentication_1.checkAuthentication)({ context, node, targetOperations: ["DELETE"] });
    function reducer(res, [key, value]) {
        (0, check_authentication_1.checkAuthentication)({ context, node, targetOperations: ["DELETE"], field: key });
        const relationField = node.relationFields.find((x) => key === x.fieldName);
        if (relationField) {
            const refNodes = [];
            const relationship = context.relationships.find((x) => x.properties === relationField.properties);
            if (relationField.union) {
                Object.keys(value).forEach((unionTypeName) => {
                    refNodes.push(context.nodes.find((x) => x.name === unionTypeName));
                });
            }
            else if (relationField.interface) {
                relationField.interface.implementations?.forEach((implementationName) => {
                    refNodes.push(context.nodes.find((x) => x.name === implementationName));
                });
            }
            else {
                refNodes.push(context.nodes.find((x) => x.name === relationField.typeMeta.name));
            }
            const inStr = relationField.direction === "IN" ? "<-" : "-";
            const outStr = relationField.direction === "OUT" ? "->" : "-";
            refNodes.forEach((refNode) => {
                (0, check_authentication_1.checkAuthentication)({ context, node: refNode, targetOperations: ["DELETE"] });
                const v = relationField.union ? value[refNode.name] : value;
                const deletes = relationField.typeMeta.array ? v : [v];
                deletes.forEach((d, index) => {
                    const innerStrs = [];
                    const variableName = chainStr
                        ? `${varName}${index}`
                        : `${varName}_${key}${relationField.union || relationField.interface ? `_${refNode.name}` : ""}${index}`;
                    const relationshipVariable = `${variableName}_relationship`;
                    const relTypeStr = `[${relationshipVariable}:${relationField.type}]`;
                    const nodeToDelete = `${variableName}_to_delete`;
                    const labels = refNode.getLabelString(context);
                    const varsWithoutMeta = (0, filter_meta_variable_1.filterMetaVariable)(withVars).join(", ");
                    innerStrs.push("WITH *");
                    innerStrs.push("CALL {");
                    if (withVars) {
                        if (context.subscriptionsEnabled) {
                            innerStrs.push(`WITH *`);
                            innerStrs.push(`WITH *, []  AS ${constants_1.META_CYPHER_VARIABLE}`);
                        }
                        else {
                            innerStrs.push(`WITH *`);
                        }
                    }
                    innerStrs.push(`OPTIONAL MATCH (${parentVar})${inStr}${relTypeStr}${outStr}(${variableName}${labels})`);
                    const whereStrs = [];
                    let aggregationWhere = false;
                    if (d.where) {
                        try {
                            const { cypher: whereCypher, subquery: preComputedSubqueries, params: whereParams, } = (0, create_connection_where_and_params_1.default)({
                                nodeVariable: variableName,
                                whereInput: d.where,
                                node: refNode,
                                context,
                                relationshipVariable,
                                relationship,
                                parameterPrefix: `${parameterPrefix}${!recursing ? `.${key}` : ""}${relationField.union ? `.${refNode.name}` : ""}${relationField.typeMeta.array ? `[${index}]` : ""}.where`,
                            });
                            if (whereCypher) {
                                whereStrs.push(whereCypher);
                                res.params = { ...res.params, ...whereParams };
                                if (preComputedSubqueries) {
                                    innerStrs.push(preComputedSubqueries);
                                    aggregationWhere = true;
                                }
                            }
                        }
                        catch (err) {
                            innerStrs.push(" \n}");
                            return;
                        }
                    }
                    const authorizationAndParams = (0, create_authorization_before_and_params_1.createAuthorizationBeforeAndParams)({
                        context,
                        nodes: [
                            {
                                variable: variableName,
                                node: refNode,
                            },
                        ],
                        operations: ["DELETE"],
                    });
                    if (authorizationAndParams) {
                        const { cypher, params, subqueries } = authorizationAndParams;
                        whereStrs.push(cypher);
                        res.params = { ...res.params, ...params };
                        if (subqueries) {
                            innerStrs.push(subqueries);
                        }
                    }
                    if (whereStrs.length) {
                        const predicate = `${whereStrs.join(" AND ")}`;
                        if (aggregationWhere) {
                            const columns = [
                                new cypher_builder_1.default.NamedVariable(relationshipVariable),
                                new cypher_builder_1.default.NamedVariable(variableName),
                            ];
                            const caseWhereClause = (0, case_where_1.caseWhere)(new cypher_builder_1.default.RawCypher(predicate), columns);
                            const { cypher } = caseWhereClause.build("aggregateWhereFilter");
                            innerStrs.push(cypher);
                        }
                        else {
                            innerStrs.push(`WHERE ${predicate}`);
                        }
                    }
                    if (d.delete) {
                        const nestedDeleteInput = Object.entries(d.delete)
                            .filter(([k]) => {
                            if (k === "_on") {
                                return false;
                            }
                            if (relationField.interface && d.delete?._on?.[refNode.name]) {
                                const onArray = Array.isArray(d.delete._on[refNode.name])
                                    ? d.delete._on[refNode.name]
                                    : [d.delete._on[refNode.name]];
                                if (onArray.some((onKey) => Object.prototype.hasOwnProperty.call(onKey, k))) {
                                    return false;
                                }
                            }
                            return true;
                        })
                            .reduce((d1, [k1, v1]) => ({ ...d1, [k1]: v1 }), {});
                        const innerWithVars = context.subscriptionsEnabled
                            ? [...withVars, variableName, relationshipVariable]
                            : [...withVars, variableName];
                        const deleteAndParams = createDeleteAndParams({
                            context,
                            node: refNode,
                            deleteInput: nestedDeleteInput,
                            varName: variableName,
                            withVars: innerWithVars,
                            parentVar: variableName,
                            parameterPrefix: `${parameterPrefix}${!recursing ? `.${key}` : ""}${relationField.union ? `.${refNode.name}` : ""}${relationField.typeMeta.array ? `[${index}]` : ""}.delete`,
                            recursing: false,
                        });
                        innerStrs.push(deleteAndParams[0]);
                        res.params = { ...res.params, ...deleteAndParams[1] };
                        if (relationField.interface && d.delete?._on?.[refNode.name]) {
                            const onDeletes = Array.isArray(d.delete._on[refNode.name])
                                ? d.delete._on[refNode.name]
                                : [d.delete._on[refNode.name]];
                            onDeletes.forEach((onDelete, onDeleteIndex) => {
                                const onDeleteAndParams = createDeleteAndParams({
                                    context,
                                    node: refNode,
                                    deleteInput: onDelete,
                                    varName: variableName,
                                    withVars: innerWithVars,
                                    parentVar: variableName,
                                    parameterPrefix: `${parameterPrefix}${!recursing ? `.${key}` : ""}${relationField.union ? `.${refNode.name}` : ""}${relationField.typeMeta.array ? `[${index}]` : ""}.delete._on.${refNode.name}[${onDeleteIndex}]`,
                                    recursing: false,
                                });
                                innerStrs.push(onDeleteAndParams[0]);
                                res.params = { ...res.params, ...onDeleteAndParams[1] };
                            });
                        }
                    }
                    if (context.subscriptionsEnabled) {
                        const metaObjectStr = (0, create_event_meta_1.createEventMetaObject)({
                            event: "delete",
                            nodeVariable: "x",
                            typename: refNode.name,
                        });
                        const [fromVariable, toVariable] = relationField.direction === "IN" ? ["x", parentVar] : [parentVar, "x"];
                        const [fromTypename, toTypename] = relationField.direction === "IN" ? [refNode.name, node.name] : [node.name, refNode.name];
                        const eventWithMetaStr = (0, create_connection_event_meta_1.createConnectionEventMetaObject)({
                            event: "delete_relationship",
                            relVariable: relationshipVariable,
                            fromVariable,
                            toVariable,
                            typename: relationField.typeUnescaped,
                            fromTypename,
                            toTypename,
                        });
                        const statements = [
                            `WITH ${varsWithoutMeta}, ${constants_1.META_CYPHER_VARIABLE}, ${relationshipVariable}, collect(DISTINCT ${variableName}) AS ${nodeToDelete}`,
                            "CALL {",
                            `\tWITH ${relationshipVariable}, ${nodeToDelete}, ${varsWithoutMeta}`,
                            `\tUNWIND ${nodeToDelete} AS x`,
                            `\tWITH [] + ${metaObjectStr} + ${eventWithMetaStr} AS ${constants_1.META_CYPHER_VARIABLE}, x, ${relationshipVariable}, ${varsWithoutMeta}`,
                            `\tDETACH DELETE x`,
                            `\tRETURN collect(${constants_1.META_CYPHER_VARIABLE}) AS delete_meta`,
                            `}`,
                            `WITH delete_meta, ${constants_1.META_CYPHER_VARIABLE}`,
                            `RETURN reduce(m=${constants_1.META_CYPHER_VARIABLE}, n IN delete_meta | m + n) AS delete_meta`,
                            `}`,
                            `WITH ${varsWithoutMeta}, ${constants_1.META_CYPHER_VARIABLE}, collect(delete_meta) as delete_meta`,
                            `WITH ${varsWithoutMeta}, reduce(m=${constants_1.META_CYPHER_VARIABLE}, n IN delete_meta | m + n) AS ${constants_1.META_CYPHER_VARIABLE}`,
                        ];
                        innerStrs.push(...statements);
                    }
                    else {
                        const statements = [
                            `WITH ${relationshipVariable}, collect(DISTINCT ${variableName}) AS ${nodeToDelete}`,
                            "CALL {",
                            `\tWITH ${nodeToDelete}`,
                            `\tUNWIND ${nodeToDelete} AS x`,
                            `\tDETACH DELETE x`,
                            `}`,
                            `}`,
                        ];
                        innerStrs.push(...statements);
                    }
                    res.strs.push(...innerStrs);
                });
            });
            return res;
        }
        return res;
    }
    const { strs, params } = Object.entries(deleteInput).reduce(reducer, {
        strs: [],
        params: {},
    });
    return [strs.join("\n"), params];
}
exports.default = createDeleteAndParams;
//# sourceMappingURL=create-delete-and-params.js.map