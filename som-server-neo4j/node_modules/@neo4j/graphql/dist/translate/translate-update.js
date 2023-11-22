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
const create_projection_and_params_1 = __importDefault(require("./create-projection-and-params"));
const create_create_and_params_1 = __importDefault(require("./create-create-and-params"));
const create_update_and_params_1 = __importDefault(require("./create-update-and-params"));
const create_connect_and_params_1 = __importDefault(require("./create-connect-and-params"));
const create_disconnect_and_params_1 = __importDefault(require("./create-disconnect-and-params"));
const constants_1 = require("../constants");
const create_delete_and_params_1 = __importDefault(require("./create-delete-and-params"));
const create_set_relationship_properties_and_params_1 = __importDefault(require("./create-set-relationship-properties-and-params"));
const translate_top_level_match_1 = require("./translate-top-level-match");
const create_connect_or_create_and_params_1 = require("./create-connect-or-create-and-params");
const create_relationship_validation_string_1 = __importDefault(require("./create-relationship-validation-string"));
const CallbackBucket_1 = require("../classes/CallbackBucket");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_connection_event_meta_1 = require("../translate/subscriptions/create-connection-event-meta");
const filter_meta_variable_1 = require("../translate/subscriptions/filter-meta-variable");
const compile_cypher_1 = require("../utils/compile-cypher");
const get_authorization_statements_1 = require("./utils/get-authorization-statements");
async function translateUpdate({ node, context, }) {
    const { resolveTree } = context;
    const updateInput = resolveTree.args.update;
    const connectInput = resolveTree.args.connect;
    const disconnectInput = resolveTree.args.disconnect;
    const createInput = resolveTree.args.create;
    const deleteInput = resolveTree.args.delete;
    const connectOrCreateInput = resolveTree.args.connectOrCreate;
    const varName = "this";
    const callbackBucket = new CallbackBucket_1.CallbackBucket(context);
    const cypherFieldAliasMap = {};
    const withVars = [varName];
    if (context.subscriptionsEnabled) {
        withVars.push(constants_1.META_CYPHER_VARIABLE);
    }
    let matchAndWhereStr = "";
    let updateStr = "";
    const connectStrs = [];
    const disconnectStrs = [];
    const createStrs = [];
    let deleteStr = "";
    let projAuth = undefined;
    const assumeReconnecting = Boolean(connectInput) && Boolean(disconnectInput);
    const matchNode = new cypher_builder_1.default.NamedNode(varName, { labels: node.getLabels(context) });
    const where = resolveTree.args.where;
    const topLevelMatch = (0, translate_top_level_match_1.translateTopLevelMatch)({ matchNode, node, context, operation: "UPDATE", where });
    matchAndWhereStr = topLevelMatch.cypher;
    let cypherParams = topLevelMatch.params;
    const connectionStrs = [];
    const interfaceStrs = [];
    let updateArgs = {};
    const mutationResponse = resolveTree.fieldsByTypeName[node.mutationResponseTypeNames.update] || {};
    const nodeProjection = Object.values(mutationResponse).find((field) => field.name === node.plural);
    if (deleteInput) {
        const deleteAndParams = (0, create_delete_and_params_1.default)({
            context,
            node,
            deleteInput,
            varName: `${varName}_delete`,
            parentVar: varName,
            withVars,
            parameterPrefix: `${resolveTree.name}.args.delete`,
        });
        [deleteStr] = deleteAndParams;
        cypherParams = {
            ...cypherParams,
            ...deleteAndParams[1],
        };
        updateArgs = {
            ...updateArgs,
            ...(deleteStr.includes(resolveTree.name) ? { delete: deleteInput } : {}),
        };
    }
    if (disconnectInput) {
        Object.entries(disconnectInput).forEach((entry) => {
            const relationField = node.relationFields.find((x) => x.fieldName === entry[0]);
            const refNodes = [];
            if (relationField.union) {
                Object.keys(entry[1]).forEach((unionTypeName) => {
                    refNodes.push(context.nodes.find((x) => x.name === unionTypeName));
                });
            }
            else if (relationField.interface) {
                relationField.interface?.implementations?.forEach((implementationName) => {
                    refNodes.push(context.nodes.find((x) => x.name === implementationName));
                });
            }
            else {
                refNodes.push(context.nodes.find((x) => x.name === relationField.typeMeta.name));
            }
            if (relationField.interface) {
                const disconnectAndParams = (0, create_disconnect_and_params_1.default)({
                    context,
                    parentVar: varName,
                    refNodes,
                    relationField,
                    value: entry[1],
                    varName: `${varName}_disconnect_${entry[0]}`,
                    withVars,
                    parentNode: node,
                    parameterPrefix: `${resolveTree.name}.args.disconnect.${entry[0]}`,
                    labelOverride: "",
                });
                disconnectStrs.push(disconnectAndParams[0]);
                cypherParams = { ...cypherParams, ...disconnectAndParams[1] };
            }
            else {
                refNodes.forEach((refNode) => {
                    const disconnectAndParams = (0, create_disconnect_and_params_1.default)({
                        context,
                        parentVar: varName,
                        refNodes: [refNode],
                        relationField,
                        value: relationField.union ? entry[1][refNode.name] : entry[1],
                        varName: `${varName}_disconnect_${entry[0]}${relationField.union ? `_${refNode.name}` : ""}`,
                        withVars,
                        parentNode: node,
                        parameterPrefix: `${resolveTree.name}.args.disconnect.${entry[0]}${relationField.union ? `.${refNode.name}` : ""}`,
                        labelOverride: relationField.union ? refNode.name : "",
                    });
                    disconnectStrs.push(disconnectAndParams[0]);
                    cypherParams = { ...cypherParams, ...disconnectAndParams[1] };
                });
            }
        });
        updateArgs = {
            ...updateArgs,
            disconnect: disconnectInput,
        };
    }
    if (updateInput) {
        const updateAndParams = (0, create_update_and_params_1.default)({
            context,
            callbackBucket,
            node,
            updateInput,
            varName,
            parentVar: varName,
            withVars,
            parameterPrefix: `${resolveTree.name}.args.update`,
            includeRelationshipValidation: false,
        });
        [updateStr] = updateAndParams;
        cypherParams = {
            ...cypherParams,
            ...updateAndParams[1],
        };
        updateArgs = {
            ...updateArgs,
            ...(updateStr.includes(resolveTree.name) ? { update: updateInput } : {}),
        };
    }
    if (connectInput) {
        Object.entries(connectInput).forEach((entry) => {
            const relationField = node.relationFields.find((x) => entry[0] === x.fieldName);
            const refNodes = [];
            if (relationField.union) {
                Object.keys(entry[1]).forEach((unionTypeName) => {
                    refNodes.push(context.nodes.find((x) => x.name === unionTypeName));
                });
            }
            else if (relationField.interface) {
                relationField.interface?.implementations?.forEach((implementationName) => {
                    refNodes.push(context.nodes.find((x) => x.name === implementationName));
                });
            }
            else {
                refNodes.push(context.nodes.find((x) => x.name === relationField.typeMeta.name));
            }
            if (relationField.interface) {
                if (!relationField.typeMeta.array) {
                    const inStr = relationField.direction === "IN" ? "<-" : "-";
                    const outStr = relationField.direction === "OUT" ? "->" : "-";
                    const validatePredicates = [];
                    refNodes.forEach((refNode) => {
                        const validateRelationshipExistence = `EXISTS((${varName})${inStr}[:${relationField.type}]${outStr}(:${refNode.name}))`;
                        validatePredicates.push(validateRelationshipExistence);
                    });
                    if (validatePredicates.length) {
                        connectStrs.push("WITH *");
                        connectStrs.push(`WHERE apoc.util.validatePredicate(${validatePredicates.join(" OR ")},'Relationship field "%s.%s" cannot have more than one node linked',["${relationField.connectionPrefix}","${relationField.fieldName}"])`);
                    }
                }
                const connectAndParams = (0, create_connect_and_params_1.default)({
                    context,
                    callbackBucket,
                    parentVar: varName,
                    refNodes,
                    relationField,
                    value: entry[1],
                    varName: `${varName}_connect_${entry[0]}`,
                    withVars,
                    parentNode: node,
                    labelOverride: "",
                    includeRelationshipValidation: !!assumeReconnecting,
                    source: "UPDATE",
                });
                connectStrs.push(connectAndParams[0]);
                cypherParams = { ...cypherParams, ...connectAndParams[1] };
            }
            else {
                refNodes.forEach((refNode) => {
                    const connectAndParams = (0, create_connect_and_params_1.default)({
                        context,
                        callbackBucket,
                        parentVar: varName,
                        refNodes: [refNode],
                        relationField,
                        value: relationField.union ? entry[1][refNode.name] : entry[1],
                        varName: `${varName}_connect_${entry[0]}${relationField.union ? `_${refNode.name}` : ""}`,
                        withVars,
                        parentNode: node,
                        labelOverride: relationField.union ? refNode.name : "",
                        source: "UPDATE",
                    });
                    connectStrs.push(connectAndParams[0]);
                    cypherParams = { ...cypherParams, ...connectAndParams[1] };
                });
            }
        });
    }
    if (connectOrCreateInput) {
        Object.entries(connectOrCreateInput).forEach(([key, input]) => {
            const relationField = node.relationFields.find((x) => key === x.fieldName);
            const refNodes = [];
            if (relationField.union) {
                Object.keys(input).forEach((unionTypeName) => {
                    refNodes.push(context.nodes.find((x) => x.name === unionTypeName));
                });
            }
            else if (relationField.interface) {
                relationField.interface?.implementations?.forEach((implementationName) => {
                    refNodes.push(context.nodes.find((x) => x.name === implementationName));
                });
            }
            else {
                refNodes.push(context.nodes.find((x) => x.name === relationField.typeMeta.name));
            }
            refNodes.forEach((refNode) => {
                const { cypher, params } = (0, create_connect_or_create_and_params_1.createConnectOrCreateAndParams)({
                    input: input[refNode.name] || input,
                    varName: `${varName}_connectOrCreate_${key}${relationField.union ? `_${refNode.name}` : ""}`,
                    parentVar: varName,
                    relationField,
                    refNode,
                    node,
                    context,
                    withVars,
                    callbackBucket,
                });
                connectStrs.push(cypher);
                cypherParams = { ...cypherParams, ...params };
            });
        });
    }
    if (createInput) {
        Object.entries(createInput).forEach((entry) => {
            const relationField = node.relationFields.find((x) => entry[0] === x.fieldName);
            const refNodes = [];
            if (relationField.union) {
                Object.keys(entry[1]).forEach((unionTypeName) => {
                    refNodes.push(context.nodes.find((x) => x.name === unionTypeName));
                });
            }
            else if (relationField.interface) {
                relationField.interface?.implementations?.forEach((implementationName) => {
                    refNodes.push(context.nodes.find((x) => x.name === implementationName));
                });
            }
            else {
                refNodes.push(context.nodes.find((x) => x.name === relationField.typeMeta.name));
            }
            const inStr = relationField.direction === "IN" ? "<-" : "-";
            const outStr = relationField.direction === "OUT" ? "->" : "-";
            refNodes.forEach((refNode) => {
                let v = relationField.union ? entry[1][refNode.name] : entry[1];
                if (relationField.interface) {
                    if (relationField.typeMeta.array) {
                        v = entry[1]
                            .filter((c) => Object.keys(c.node).includes(refNode.name))
                            .map((c) => ({ edge: c.edge, node: c.node[refNode.name] }));
                        if (!v.length) {
                            return;
                        }
                    }
                    else {
                        if (!entry[1].node[refNode.name]) {
                            return;
                        }
                        v = { edge: entry[1].edge, node: entry[1].node[refNode.name] };
                    }
                }
                const creates = relationField.typeMeta.array ? v : [v];
                creates.forEach((create, index) => {
                    const baseName = `${varName}_create_${entry[0]}${relationField.union || relationField.interface ? `_${refNode.name}` : ""}${index}`;
                    const nodeName = `${baseName}_node${relationField.interface ? `_${refNode.name}` : ""}`;
                    const propertiesName = `${baseName}_relationship`;
                    const relationVarName = relationField.properties || context.subscriptionsEnabled ? propertiesName : "";
                    const relTypeStr = `[${relationVarName}:${relationField.type}]`;
                    if (!relationField.typeMeta.array) {
                        createStrs.push("WITH *");
                        const validatePredicateTemplate = (condition) => `WHERE apoc.util.validatePredicate(${condition},'Relationship field "%s.%s" cannot have more than one node linked',["${relationField.connectionPrefix}","${relationField.fieldName}"])`;
                        const singleCardinalityValidationTemplate = (nodeName) => `EXISTS((${varName})${inStr}[:${relationField.type}]${outStr}(:${nodeName}))`;
                        if (relationField.union && relationField.union.nodes) {
                            const validateRelationshipExistence = relationField.union.nodes.map(singleCardinalityValidationTemplate);
                            createStrs.push(validatePredicateTemplate(validateRelationshipExistence.join(" OR ")));
                        }
                        else if (relationField.interface && relationField.interface.implementations) {
                            const validateRelationshipExistence = relationField.interface.implementations.map(singleCardinalityValidationTemplate);
                            createStrs.push(validatePredicateTemplate(validateRelationshipExistence.join(" OR ")));
                        }
                        else {
                            const validateRelationshipExistence = singleCardinalityValidationTemplate(refNode.name);
                            createStrs.push(validatePredicateTemplate(validateRelationshipExistence));
                        }
                    }
                    const { create: nestedCreate, params, authorizationPredicates, authorizationSubqueries, } = (0, create_create_and_params_1.default)({
                        context,
                        callbackBucket,
                        node: refNode,
                        input: create.node,
                        varName: nodeName,
                        withVars: [...withVars, nodeName],
                        includeRelationshipValidation: false,
                    });
                    createStrs.push(nestedCreate);
                    cypherParams = { ...cypherParams, ...params };
                    createStrs.push(`MERGE (${varName})${inStr}${relTypeStr}${outStr}(${nodeName})`);
                    if (relationField.properties) {
                        const relationship = context.relationships.find((x) => x.properties === relationField.properties);
                        const setA = (0, create_set_relationship_properties_and_params_1.default)({
                            properties: create.edge ?? {},
                            varName: propertiesName,
                            relationship,
                            operation: "CREATE",
                            callbackBucket,
                        });
                        createStrs.push(setA[0]);
                        cypherParams = { ...cypherParams, ...setA[1] };
                    }
                    creates.push(...(0, get_authorization_statements_1.getAuthorizationStatements)(authorizationPredicates, authorizationSubqueries));
                    if (context.subscriptionsEnabled) {
                        const [fromVariable, toVariable] = relationField.direction === "IN" ? [nodeName, varName] : [varName, nodeName];
                        const [fromTypename, toTypename] = relationField.direction === "IN" ? [refNode.name, node.name] : [node.name, refNode.name];
                        const eventWithMetaStr = (0, create_connection_event_meta_1.createConnectionEventMeta)({
                            event: "create_relationship",
                            relVariable: propertiesName,
                            fromVariable,
                            toVariable,
                            typename: relationField.typeUnescaped,
                            fromTypename,
                            toTypename,
                        });
                        createStrs.push(`WITH ${eventWithMetaStr}, ${(0, filter_meta_variable_1.filterMetaVariable)([...withVars, nodeName]).join(", ")}`);
                    }
                });
            });
        });
    }
    let projectionSubquery;
    let projStr;
    if (nodeProjection?.fieldsByTypeName) {
        const projection = (0, create_projection_and_params_1.default)({
            node,
            context,
            resolveTree: nodeProjection,
            varName: new cypher_builder_1.default.NamedNode(varName),
            cypherFieldAliasMap,
        });
        projectionSubquery = cypher_builder_1.default.concat(...projection.subqueriesBeforeSort, ...projection.subqueries);
        projStr = projection.projection;
        cypherParams = { ...cypherParams, ...projection.params };
        const predicates = [];
        predicates.push(...projection.predicates);
        if (predicates.length) {
            projAuth = new cypher_builder_1.default.With("*").where(cypher_builder_1.default.and(...predicates));
        }
    }
    const returnStatement = generateUpdateReturnStatement(varName, projStr, context.subscriptionsEnabled);
    const relationshipValidationStr = (0, create_relationship_validation_string_1.default)({ node, context, varName });
    const updateQuery = new cypher_builder_1.default.RawCypher((env) => {
        const projectionSubqueryStr = projectionSubquery ? (0, compile_cypher_1.compileCypher)(projectionSubquery, env) : "";
        const cypher = [
            ...(context.subscriptionsEnabled ? [`WITH [] AS ${constants_1.META_CYPHER_VARIABLE}`] : []),
            matchAndWhereStr,
            deleteStr,
            disconnectStrs.join("\n"),
            updateStr,
            connectStrs.join("\n"),
            createStrs.join("\n"),
            ...(deleteStr.length ||
                connectStrs.length ||
                disconnectStrs.length ||
                createStrs.length ||
                projectionSubqueryStr
                ? [`WITH *`]
                : []),
            projectionSubqueryStr,
            ...(connectionStrs.length ? [`WITH *`] : []),
            ...(projAuth ? [(0, compile_cypher_1.compileCypher)(projAuth, env)] : []),
            ...(relationshipValidationStr ? [`WITH *`, relationshipValidationStr] : []),
            ...connectionStrs,
            ...interfaceStrs,
            ...(context.subscriptionsEnabled
                ? [
                    `WITH *`,
                    `UNWIND (CASE ${constants_1.META_CYPHER_VARIABLE} WHEN [] then [null] else ${constants_1.META_CYPHER_VARIABLE} end) AS m`,
                ]
                : []),
            (0, compile_cypher_1.compileCypher)(returnStatement, env),
        ]
            .filter(Boolean)
            .join("\n");
        return [
            cypher,
            {
                ...cypherParams,
                ...(Object.keys(updateArgs).length ? { [resolveTree.name]: { args: updateArgs } } : {}),
            },
        ];
    });
    const cypherResult = updateQuery.build("update_");
    const { cypher, params: resolvedCallbacks } = await callbackBucket.resolveCallbacksAndFilterCypher({
        cypher: cypherResult.cypher,
    });
    const result = [cypher, { ...cypherResult.params, resolvedCallbacks }];
    return result;
}
exports.default = translateUpdate;
function generateUpdateReturnStatement(varName, projStr, subscriptionsEnabled) {
    let statements;
    if (varName && projStr) {
        statements = new cypher_builder_1.default.RawCypher((env) => `collect(DISTINCT ${varName} ${(0, compile_cypher_1.compileCypher)(projStr, env)}) AS data`);
    }
    if (subscriptionsEnabled) {
        statements = cypher_builder_1.default.concat(statements, new cypher_builder_1.default.RawCypher(statements ? ", " : ""), new cypher_builder_1.default.RawCypher(`collect(DISTINCT m) as ${constants_1.META_CYPHER_VARIABLE}`));
    }
    if (!statements) {
        statements = new cypher_builder_1.default.RawCypher("'Query cannot conclude with CALL'");
    }
    return new cypher_builder_1.default.Return(statements);
}
//# sourceMappingURL=translate-update.js.map