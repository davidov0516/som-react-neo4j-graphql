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
exports.translateCypherDirectiveProjection = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const create_projection_and_params_1 = __importDefault(require("../../create-projection-and-params"));
const compile_cypher_1 = require("../../../utils/compile-cypher");
function translateCypherDirectiveProjection({ context, cypherField, field, node, alias, nodeRef, res, cypherFieldAliasMap, }) {
    const resultVariable = new cypher_builder_1.default.Node();
    cypherFieldAliasMap[alias] = resultVariable;
    const referenceNode = context.nodes.find((x) => x.name === cypherField.typeMeta.name);
    const entity = context.schemaModel.entities.get(cypherField.typeMeta.name);
    const isArray = Boolean(cypherField.typeMeta.array);
    const fieldFields = field.fieldsByTypeName;
    const subqueries = [];
    const predicates = [];
    let projectionExpr;
    let hasUnionLabelsPredicate;
    if (cypherField.statement.includes("$jwt")) {
        res.params.jwt = context.authorization.jwtParam.value;
    }
    if (referenceNode) {
        const { projection: str, params: p, subqueries: nestedSubqueries, subqueriesBeforeSort: nestedSubqueriesBeforeSort, predicates: nestedPredicates, } = (0, create_projection_and_params_1.default)({
            resolveTree: field,
            node: referenceNode || node,
            context,
            varName: resultVariable,
            cypherFieldAliasMap,
        });
        projectionExpr = new cypher_builder_1.default.RawCypher((env) => {
            return `${(0, compile_cypher_1.compileCypher)(resultVariable, env)} ${(0, compile_cypher_1.compileCypher)(str, env)}`;
        });
        res.params = { ...res.params, ...p };
        subqueries.push(...nestedSubqueriesBeforeSort, ...nestedSubqueries);
        predicates.push(...nestedPredicates);
    }
    else if (entity?.isCompositeEntity()) {
        const unionProjections = [];
        const labelsSubPredicates = [];
        const fieldFieldsKeys = Object.keys(fieldFields);
        const hasMultipleFieldFields = fieldFieldsKeys.length > 1;
        let referencedNodes = entity.concreteEntities
            ?.map((u) => context.nodes.find((n) => n.name === u.name))
            ?.filter((b) => b !== undefined) || [];
        if (hasMultipleFieldFields) {
            referencedNodes = referencedNodes?.filter((n) => fieldFieldsKeys.includes(n?.name ?? "")) || [];
        }
        referencedNodes.forEach((refNode) => {
            if (refNode) {
                const subqueryParam = new cypher_builder_1.default.Node();
                const cypherNodeRef = resultVariable;
                const hasLabelsPredicates = refNode.getLabels(context).map((label) => cypherNodeRef.hasLabel(label));
                const labelsSubPredicate = cypher_builder_1.default.and(...hasLabelsPredicates);
                labelsSubPredicates.push(labelsSubPredicate);
                if (fieldFields[refNode.name]) {
                    const { projection: str, params: p, subqueries: nestedSubqueries, predicates: nestedPredicates, } = (0, create_projection_and_params_1.default)({
                        resolveTree: field,
                        node: refNode,
                        context,
                        varName: subqueryParam,
                        cypherFieldAliasMap,
                    });
                    if (nestedSubqueries.length > 0) {
                        const projectionVariable = subqueryParam;
                        const beforeCallWith = new cypher_builder_1.default.With("*", [cypherNodeRef, projectionVariable]);
                        const withAndSubqueries = cypher_builder_1.default.concat(beforeCallWith, ...nestedSubqueries);
                        subqueries.push(withAndSubqueries);
                    }
                    const projection = new cypher_builder_1.default.RawCypher((env) => `{ __resolveType: "${refNode.name}", ${(0, compile_cypher_1.compileCypher)(str, env).replace("{", "")}`);
                    unionProjections.push({
                        projection,
                        predicate: labelsSubPredicate,
                    });
                    res.predicates.push(...nestedPredicates);
                    res.params = { ...res.params, ...p };
                }
                else {
                    const projection = new cypher_builder_1.default.RawCypher(() => `{ __resolveType: "${refNode.name}" }`);
                    unionProjections.push({
                        projection,
                        predicate: labelsSubPredicate,
                    });
                }
            }
        });
        hasUnionLabelsPredicate = cypher_builder_1.default.or(...labelsSubPredicates);
        projectionExpr = new cypher_builder_1.default.Case();
        for (const { projection, predicate } of unionProjections) {
            projectionExpr
                .when(predicate)
                .then(new cypher_builder_1.default.RawCypher((env) => `${(0, compile_cypher_1.compileCypher)(resultVariable, env)} ${(0, compile_cypher_1.compileCypher)(projection, env)}`));
        }
    }
    // Null default argument values are not passed into the resolve tree therefore these are not being passed to
    // `apocParams` below causing a runtime error when executing.
    const nullArgumentValues = cypherField.arguments.reduce((r, argument) => ({
        ...r,
        [argument.name.value]: null,
    }), {});
    const extraArgs = { ...nullArgumentValues, ...field.args };
    const customCypherClause = createCypherDirectiveSubquery({
        cypherField,
        nodeRef,
        resultVariable,
        extraArgs,
    });
    const unionExpression = hasUnionLabelsPredicate ? new cypher_builder_1.default.With("*").where(hasUnionLabelsPredicate) : undefined;
    const returnClause = createReturnClause({
        isArray,
        returnVariable: resultVariable,
        projectionExpr,
    });
    const callSt = new cypher_builder_1.default.Call(cypher_builder_1.default.concat(customCypherClause, unionExpression, ...subqueries, returnClause)).innerWith(nodeRef);
    const sortInput = (context.resolveTree.args.sort ??
        context.resolveTree.args.options?.sort ??
        []);
    const isSortArg = sortInput.find((obj) => Object.keys(obj).includes(alias));
    if (isSortArg) {
        res.subqueriesBeforeSort.push(callSt);
    }
    else {
        res.subqueries.push(callSt);
    }
    const aliasVar = new cypher_builder_1.default.NamedVariable(alias);
    res.projection.push(new cypher_builder_1.default.RawCypher((env) => `${(0, compile_cypher_1.compileCypher)(aliasVar, env)}: ${(0, compile_cypher_1.compileCypher)(resultVariable, env)}`));
    return res;
}
exports.translateCypherDirectiveProjection = translateCypherDirectiveProjection;
function createCypherDirectiveSubquery({ cypherField, nodeRef, resultVariable, extraArgs, }) {
    const innerWithAlias = new cypher_builder_1.default.With([nodeRef, new cypher_builder_1.default.NamedNode("this")]);
    const rawCypher = new cypher_builder_1.default.RawCypher((env) => {
        let statement = cypherField.statement;
        for (const [key, value] of Object.entries(extraArgs)) {
            const param = new cypher_builder_1.default.Param(value);
            const paramName = param.getCypher(env);
            statement = statement.replaceAll(`$${key}`, `${paramName}`);
        }
        return statement;
    });
    const callClause = new cypher_builder_1.default.Call(cypher_builder_1.default.concat(innerWithAlias, rawCypher)).innerWith(nodeRef);
    if (cypherField.columnName) {
        const columnVariable = new cypher_builder_1.default.NamedVariable(cypherField.columnName);
        if (cypherField.isScalar || cypherField.isEnum) {
            callClause.unwind([columnVariable, resultVariable]);
        }
        else {
            callClause.with([columnVariable, resultVariable]);
        }
    }
    return callClause;
}
function createReturnClause({ returnVariable, isArray, projectionExpr, }) {
    let returnData = projectionExpr || returnVariable;
    returnData = cypher_builder_1.default.collect(returnData);
    if (!isArray) {
        returnData = cypher_builder_1.default.head(returnData);
    }
    return new cypher_builder_1.default.Return([returnData, returnVariable]);
}
//# sourceMappingURL=translate-cypher-directive-projection.js.map