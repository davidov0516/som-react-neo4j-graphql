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
const utils_1 = require("@graphql-tools/utils");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_datetime_element_1 = require("./projection/elements/create-datetime-element");
const create_point_element_1 = require("./projection/elements/create-point-element");
const map_to_db_property_1 = __importDefault(require("../utils/map-to-db-property"));
const create_field_aggregation_1 = require("./field-aggregations/create-field-aggregation");
const global_node_projection_1 = require("../utils/global-node-projection");
const get_relationship_direction_1 = require("../utils/get-relationship-direction");
const resolveTree_1 = require("./utils/resolveTree");
const utils_2 = require("../utils/utils");
const create_projection_subquery_1 = require("./projection/subquery/create-projection-subquery");
const collect_union_subqueries_results_1 = require("./projection/subquery/collect-union-subqueries-results");
const create_connection_clause_1 = require("./connection-clause/create-connection-clause");
const translate_cypher_directive_projection_1 = require("./projection/subquery/translate-cypher-directive-projection");
const create_authorization_before_predicate_1 = require("./authorization/create-authorization-before-predicate");
const check_authentication_1 = require("./authorization/check-authentication");
const compile_cypher_1 = require("../utils/compile-cypher");
function createProjectionAndParams({ resolveTree, node, context, varName, literalElements, resolveType, cypherFieldAliasMap, }) {
    (0, check_authentication_1.checkAuthentication)({ context, node, targetOperations: ["READ"] });
    function reducer(res, field) {
        const alias = field.alias;
        // if not aggregation/ connection
        (0, check_authentication_1.checkAuthentication)({ context, node, targetOperations: ["READ"], field: field.name });
        const whereInput = field.args.where;
        const optionsInput = (field.args.options || {});
        const cypherField = node.cypherFields.find((x) => x.fieldName === field.name);
        const relationField = node.relationFields.find((x) => x.fieldName === field.name);
        const connectionField = node.connectionFields.find((x) => x.fieldName === field.name);
        const pointField = node.pointFields.find((x) => x.fieldName === field.name);
        const temporalField = node.temporalFields.find((x) => x.fieldName === field.name);
        const authableField = node.authableFields.find((x) => x.fieldName === field.name);
        if (authableField) {
            const authorizationPredicateReturn = (0, create_authorization_before_predicate_1.createAuthorizationBeforePredicate)({
                context,
                nodes: [
                    {
                        variable: varName,
                        node,
                        fieldName: authableField.fieldName,
                    },
                ],
                operations: ["READ"],
            });
            if (authorizationPredicateReturn) {
                const { predicate, preComputedSubqueries } = authorizationPredicateReturn;
                if (predicate) {
                    res.predicates.push(predicate);
                }
                if (preComputedSubqueries && !preComputedSubqueries.empty) {
                    res.subqueries.push(preComputedSubqueries);
                }
            }
        }
        if (cypherField) {
            return (0, translate_cypher_directive_projection_1.translateCypherDirectiveProjection)({
                context,
                cypherField,
                field,
                node,
                alias,
                nodeRef: varName,
                res,
                cypherFieldAliasMap,
            });
        }
        if (relationField) {
            const referenceNode = context.nodes.find((x) => x.name === relationField.typeMeta.name);
            if (referenceNode?.limit) {
                optionsInput.limit = referenceNode.limit.getLimit(optionsInput.limit);
            }
            const subqueryReturnAlias = new cypher_builder_1.default.Variable();
            if (relationField.interface || relationField.union) {
                let referenceNodes;
                if (relationField.interface) {
                    const interfaceImplementations = context.nodes.filter((x) => relationField.interface?.implementations?.includes(x.name));
                    if (field.args.where) {
                        // Enrich concrete types with shared filters
                        const interfaceSharedFilters = Object.fromEntries(Object.entries(field.args.where).filter(([key]) => key !== "_on"));
                        if (Object.keys(interfaceSharedFilters).length > 0) {
                            field.args.where = getAugmentedImplementationFilters(field.args.where, interfaceSharedFilters, interfaceImplementations);
                        }
                        else {
                            field.args.where = { ...(field.args.where["_on"] || {}) };
                        }
                    }
                    referenceNodes = interfaceImplementations.filter((x) => 
                    // where is not defined
                    !field.args.where ||
                        // where exists but has no filters defined
                        Object.keys(field.args.where).length === 0 ||
                        // where exists and has a filter on this implementation
                        Object.prototype.hasOwnProperty.call(field.args.where, x.name));
                }
                else {
                    referenceNodes = context.nodes.filter((x) => relationField.union?.nodes?.includes(x.name) &&
                        (!field.args.where || Object.prototype.hasOwnProperty.call(field.args.where, x.name)));
                }
                const parentNode = varName;
                const unionSubqueries = [];
                for (const refNode of referenceNodes) {
                    const targetNode = new cypher_builder_1.default.Node({ labels: refNode.getLabels(context) });
                    const recurse = createProjectionAndParams({
                        resolveTree: field,
                        node: refNode,
                        context,
                        varName: targetNode,
                        cypherFieldAliasMap,
                    });
                    res.params = { ...res.params, ...recurse.params };
                    const direction = (0, get_relationship_direction_1.getCypherRelationshipDirection)(relationField, field.args);
                    const nestedProjection = new cypher_builder_1.default.RawCypher((env) => {
                        // The nested projection will be surrounded by brackets, so we want to remove
                        // any linebreaks, and then the first opening and the last closing bracket of the line,
                        // as well as any surrounding whitespace.
                        const nestedProj = (0, compile_cypher_1.compileCypher)(recurse.projection, env).replaceAll(/(^\s*{\s*)|(\s*}\s*$)/g, "");
                        return `{ __resolveType: "${refNode.name}", __id: id(${(0, compile_cypher_1.compileCypher)(varName, env)})${nestedProj && `, ${nestedProj}`} }`;
                    });
                    const subquery = (0, create_projection_subquery_1.createProjectionSubquery)({
                        parentNode,
                        whereInput: field.args.where ? field.args.where[refNode.name] : {},
                        node: refNode,
                        context,
                        subqueryReturnAlias,
                        nestedProjection,
                        nestedSubqueries: [...recurse.subqueriesBeforeSort, ...recurse.subqueries],
                        targetNode,
                        relationField,
                        relationshipDirection: direction,
                        optionsInput,
                        addSkipAndLimit: false,
                        collect: false,
                        nestedPredicates: recurse.predicates,
                    });
                    const unionWith = new cypher_builder_1.default.With("*");
                    unionSubqueries.push(cypher_builder_1.default.concat(unionWith, subquery));
                }
                const unionClause = new cypher_builder_1.default.Union(...unionSubqueries);
                const collectAndLimitStatements = (0, collect_union_subqueries_results_1.collectUnionSubqueriesResults)({
                    resultVariable: subqueryReturnAlias,
                    optionsInput,
                    isArray: Boolean(relationField.typeMeta.array),
                });
                const unionAndSort = cypher_builder_1.default.concat(new cypher_builder_1.default.Call(unionClause), collectAndLimitStatements);
                res.subqueries.push(new cypher_builder_1.default.Call(unionAndSort).innerWith(parentNode));
                res.projection.push(new cypher_builder_1.default.RawCypher((env) => `${alias}: ${(0, compile_cypher_1.compileCypher)(subqueryReturnAlias, env)}`));
                return res;
            }
            const targetNode = referenceNode
                ? new cypher_builder_1.default.Node({
                    labels: referenceNode.getLabels(context),
                })
                : varName;
            const recurse = createProjectionAndParams({
                resolveTree: field,
                node: referenceNode || node,
                context,
                varName: targetNode,
                cypherFieldAliasMap,
            });
            res.params = { ...res.params, ...recurse.params };
            const direction = (0, get_relationship_direction_1.getCypherRelationshipDirection)(relationField, field.args);
            const subquery = (0, create_projection_subquery_1.createProjectionSubquery)({
                parentNode: varName,
                whereInput,
                node: referenceNode,
                context,
                subqueryReturnAlias,
                nestedProjection: recurse.projection,
                nestedSubqueries: [...recurse.subqueriesBeforeSort, ...recurse.subqueries],
                targetNode: targetNode,
                relationField,
                relationshipDirection: direction,
                optionsInput,
                nestedPredicates: recurse.predicates,
            });
            res.subqueries.push(new cypher_builder_1.default.Call(subquery).innerWith(varName));
            res.projection.push(new cypher_builder_1.default.RawCypher((env) => `${alias}: ${(0, compile_cypher_1.compileCypher)(subqueryReturnAlias, env)}`));
            return res;
        }
        const aggregationFieldProjection = (0, create_field_aggregation_1.createFieldAggregation)({
            context,
            nodeVar: varName,
            node,
            field,
        });
        if (aggregationFieldProjection) {
            if (aggregationFieldProjection.projectionSubqueryCypher) {
                res.subqueries.push(aggregationFieldProjection.projectionSubqueryCypher);
            }
            res.projection.push(new cypher_builder_1.default.RawCypher((env) => `${alias}: ${(0, compile_cypher_1.compileCypher)(aggregationFieldProjection.projectionCypher, env)}`));
            return res;
        }
        if (connectionField) {
            const returnVariable = new cypher_builder_1.default.Variable();
            const connectionClause = new cypher_builder_1.default.Call((0, create_connection_clause_1.createConnectionClause)({
                resolveTree: field,
                field: connectionField,
                context,
                nodeVariable: varName,
                returnVariable,
                cypherFieldAliasMap,
            })).innerWith(varName);
            res.subqueries.push(connectionClause);
            res.projection.push(new cypher_builder_1.default.RawCypher((env) => `${field.alias}: ${(0, compile_cypher_1.compileCypher)(returnVariable, env)}`));
            return res;
        }
        if (pointField) {
            const pointExpr = (0, create_point_element_1.createPointExpression)({ resolveTree: field, field: pointField, variable: varName });
            res.projection.push(new cypher_builder_1.default.RawCypher((env) => `${field.alias}: ${(0, compile_cypher_1.compileCypher)(pointExpr, env)}`));
        }
        else if (temporalField?.typeMeta.name === "DateTime") {
            const datetimeExpr = (0, create_datetime_element_1.createDatetimeExpression)({
                resolveTree: field,
                field: temporalField,
                variable: varName,
            });
            res.projection.push(new cypher_builder_1.default.RawCypher((env) => `${field.alias}: ${(0, compile_cypher_1.compileCypher)(datetimeExpr, env)}`));
        }
        else {
            // In the case of using the @alias directive (map a GraphQL field to a db prop)
            // the output will be RETURN varName {GraphQLfield: varName.dbAlias}
            const dbFieldName = (0, map_to_db_property_1.default)(node, field.name);
            // If field is aliased, rename projected field to alias and set to varName.fieldName
            // e.g. RETURN varname { .fieldName } -> RETURN varName { alias: varName.fieldName }
            if (alias !== field.name || dbFieldName !== field.name || literalElements) {
                res.projection.push(new cypher_builder_1.default.RawCypher((env) => `${alias}: ${(0, compile_cypher_1.compileCypher)(varName.property(dbFieldName), env)}`));
            }
            else {
                res.projection.push(new cypher_builder_1.default.RawCypher(`.${dbFieldName}`));
            }
        }
        return res;
    }
    let existingProjection = { ...resolveTree.fieldsByTypeName[node.name] };
    if (context.fulltext) {
        return createFulltextProjection({
            resolveTree,
            node,
            context,
            varName,
            literalElements,
            resolveType,
            cypherFieldAliasMap,
        });
    }
    // If we have a query for a globalNode and it includes the "id" field
    // we modify the projection to include the appropriate db fields
    if (node.isGlobalNode && existingProjection.id) {
        existingProjection = (0, global_node_projection_1.addGlobalIdField)(existingProjection, node.getGlobalIdField());
    }
    // Fields of reference node to sort on. Since sorting is done on projection, if field is not selected
    // sort will fail silently
    const sortFieldNames = (resolveTree.args.options?.sort ?? []).map(Object.keys).flat();
    // Iterate over fields name in sort argument
    const nodeFields = sortFieldNames.reduce((acc, sortFieldName) => ({
        ...acc,
        // If fieldname is not found in fields of selection set
        ...(!Object.values(existingProjection).find((field) => field.name === sortFieldName)
            ? // generate a basic resolve tree
                (0, resolveTree_1.generateResolveTree)({ name: sortFieldName })
            : {}),
    }), 
    // and add it to existing fields for projection
    existingProjection);
    // Include fields of implemented interfaces to allow for fragments on interfaces
    // cf. https://github.com/neo4j/graphql/issues/476
    const mergedSelectedFields = (0, utils_1.mergeDeep)([
        nodeFields,
        ...(0, utils_2.filterTruthy)(node.interfaces.map((i) => resolveTree.fieldsByTypeName[i.name.value])),
    ]);
    // Merge fields for final projection to account for multiple fragments
    // cf. https://github.com/neo4j/graphql/issues/920
    const mergedFields = (0, utils_1.mergeDeep)([
        mergedSelectedFields,
        generateMissingOrAliasedSortFields({ selection: mergedSelectedFields, resolveTree }),
        ...generateMissingOrAliasedRequiredFields({ selection: mergedSelectedFields, node }),
    ]);
    const { params, subqueriesBeforeSort, subqueries, predicates, projection } = Object.values(mergedFields).reduce(reducer, {
        projection: resolveType
            ? [
                new cypher_builder_1.default.RawCypher(`__resolveType: "${node.name}"`),
                new cypher_builder_1.default.RawCypher((env) => `__id: id(${(0, compile_cypher_1.compileCypher)(varName, env)})`),
            ]
            : [],
        params: {},
        subqueries: [],
        subqueriesBeforeSort: [],
        predicates: [],
    });
    const projectionCypher = new cypher_builder_1.default.RawCypher((env) => {
        return `{ ${projection.map((proj) => (0, compile_cypher_1.compileCypher)(proj, env)).join(", ")} }`;
    });
    return {
        params,
        subqueriesBeforeSort,
        subqueries,
        predicates,
        projection: projectionCypher,
    };
}
exports.default = createProjectionAndParams;
function getSortArgs(resolveTree) {
    const connectionArgs = resolveTree.args.sort;
    const optionsArgs = resolveTree.args.options?.sort;
    return connectionArgs || optionsArgs || [];
}
// Generates any missing fields required for sorting
const generateMissingOrAliasedSortFields = ({ selection, resolveTree, }) => {
    const sortArgs = getSortArgs(resolveTree);
    const sortFieldNames = (0, utils_2.removeDuplicates)(sortArgs.map(Object.keys).flat());
    return (0, resolveTree_1.generateMissingOrAliasedFields)({ fieldNames: sortFieldNames, selection });
};
// Generated any missing fields required for custom resolvers
const generateMissingOrAliasedRequiredFields = ({ node, selection, }) => {
    const requiredFields = (0, utils_2.removeDuplicates)((0, resolveTree_1.filterFieldsInSelection)({ fields: node.customResolverFields, selection })
        .map((f) => f.requiredFields)
        .flat());
    return requiredFields;
};
function createFulltextProjection({ resolveTree, node, context, varName, literalElements, resolveType, cypherFieldAliasMap, }) {
    const fieldResolveTree = resolveTree.fieldsByTypeName[node.fulltextTypeNames.result];
    const nodeResolveTree = fieldResolveTree?.[node.singular];
    if (!nodeResolveTree) {
        return {
            projection: new cypher_builder_1.default.Map(),
            params: {},
            subqueries: [],
            subqueriesBeforeSort: [],
            predicates: [],
        };
    }
    const nodeContext = { ...context, fulltext: undefined };
    return createProjectionAndParams({
        resolveTree: nodeResolveTree,
        node,
        context: nodeContext,
        varName,
        literalElements,
        resolveType,
        cypherFieldAliasMap,
    });
}
/**
 * Transform a filter applied in an interface as if it was applied to all the implementations,
 * if an implementation already has the same filter then that filter is kept and the interface filter is overridden by the implementation one.
 * */
function getAugmentedImplementationFilters(where, interfaceSharedFilters, implementations) {
    return Object.fromEntries(implementations.map((node) => {
        if (!Object.prototype.hasOwnProperty.call(where, "_on")) {
            return [node.name, { ...interfaceSharedFilters }];
        }
        return [
            node.name,
            {
                ...interfaceSharedFilters,
                ...where["_on"][node.name],
            },
        ];
    }));
}
//# sourceMappingURL=create-projection-and-params.js.map