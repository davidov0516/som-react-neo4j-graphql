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
exports.createConnectOrCreateAndParams = void 0;
const classes_1 = require("../classes");
const utils_1 = require("../utils/utils");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const callback_utils_1 = require("./utils/callback-utils");
const is_property_clash_1 = require("../utils/is-property-clash");
const create_connection_event_meta_1 = require("./subscriptions/create-connection-event-meta");
const filter_meta_variable_1 = require("./subscriptions/filter-meta-variable");
const get_relationship_direction_1 = require("../utils/get-relationship-direction");
const create_authorization_before_predicate_1 = require("./authorization/create-authorization-before-predicate");
const create_authorization_after_predicate_1 = require("./authorization/create-authorization-after-predicate");
const check_authentication_1 = require("./authorization/check-authentication");
const compile_cypher_1 = require("../utils/compile-cypher");
function createConnectOrCreateAndParams({ input, varName, parentVar, relationField, refNode, node, context, withVars, callbackBucket, }) {
    (0, utils_1.asArray)(input).forEach((connectOrCreateItem) => {
        const conflictingProperties = (0, is_property_clash_1.findConflictingProperties)({
            node: refNode,
            input: connectOrCreateItem.onCreate?.node,
        });
        if (conflictingProperties.length > 0) {
            throw new classes_1.Neo4jGraphQLError(`Conflicting modification of ${conflictingProperties.map((n) => `[[${n}]]`).join(", ")} on type ${refNode.name}`);
        }
    });
    // todo: add create
    (0, check_authentication_1.checkAuthentication)({ context, node, targetOperations: ["CREATE", "CREATE_RELATIONSHIP"] });
    (0, check_authentication_1.checkAuthentication)({ context, node: refNode, targetOperations: ["CREATE", "CREATE_RELATIONSHIP"] });
    const withVarsVariables = withVars.map((name) => new cypher_builder_1.default.NamedVariable(name));
    const statements = (0, utils_1.asArray)(input).map((inputItem, index) => {
        const subqueryBaseName = `${varName}${index}`;
        const result = createConnectOrCreatePartialStatement({
            input: inputItem,
            baseName: subqueryBaseName,
            parentVar,
            relationField,
            refNode,
            node,
            context,
            callbackBucket,
            withVars,
        });
        return result;
    });
    const wrappedQueries = statements.map((statement) => {
        const returnStatement = context.subscriptionsEnabled
            ? new cypher_builder_1.default.Return([new cypher_builder_1.default.NamedVariable("meta"), "update_meta"])
            : new cypher_builder_1.default.Return([cypher_builder_1.default.count(new cypher_builder_1.default.RawCypher("*")), "_"]);
        const withStatement = new cypher_builder_1.default.With(...withVarsVariables);
        const callStatement = new cypher_builder_1.default.Call(cypher_builder_1.default.concat(statement, returnStatement)).innerWith(...withVarsVariables);
        const subqueryClause = cypher_builder_1.default.concat(withStatement, callStatement);
        if (context.subscriptionsEnabled) {
            const afterCallWithStatement = new cypher_builder_1.default.With("*", [new cypher_builder_1.default.NamedVariable("update_meta"), "meta"]);
            cypher_builder_1.default.concat(subqueryClause, afterCallWithStatement);
        }
        return subqueryClause;
    });
    const query = cypher_builder_1.default.concat(...wrappedQueries);
    return query.build(`${varName}_`);
}
exports.createConnectOrCreateAndParams = createConnectOrCreateAndParams;
function createConnectOrCreatePartialStatement({ input, baseName, parentVar, relationField, refNode, node, context, callbackBucket, withVars, }) {
    let mergeQuery;
    // TODO: connectOrCreate currently doesn't honour field-level authorization - this should be fixed
    const authorizationBeforePredicateReturn = createAuthorizationBeforeConnectOrCreate({
        context,
        sourceNode: node,
        sourceName: parentVar,
        targetNode: refNode,
        targetName: baseName,
    });
    if (authorizationBeforePredicateReturn.predicate) {
        if (authorizationBeforePredicateReturn.preComputedSubqueries) {
            mergeQuery = cypher_builder_1.default.concat(mergeQuery, new cypher_builder_1.default.With("*"), authorizationBeforePredicateReturn.preComputedSubqueries);
        }
        mergeQuery = cypher_builder_1.default.concat(mergeQuery, new cypher_builder_1.default.With("*").where(authorizationBeforePredicateReturn.predicate));
    }
    const mergeCypher = mergeStatement({
        input,
        refNode,
        parentRefNode: node,
        context,
        relationField,
        parentNode: new cypher_builder_1.default.NamedNode(parentVar),
        varName: baseName,
        callbackBucket,
        withVars,
    });
    mergeQuery = cypher_builder_1.default.concat(mergeQuery, mergeCypher);
    const authorizationAfterPredicateReturn = createAuthorizationAfterConnectOrCreate({
        context,
        sourceNode: node,
        sourceName: parentVar,
        targetNode: refNode,
        targetName: baseName,
    });
    if (authorizationAfterPredicateReturn.predicate) {
        if (authorizationAfterPredicateReturn.preComputedSubqueries) {
            mergeQuery = cypher_builder_1.default.concat(mergeQuery, new cypher_builder_1.default.With("*"), authorizationAfterPredicateReturn.preComputedSubqueries);
        }
        mergeQuery = cypher_builder_1.default.concat(mergeQuery, new cypher_builder_1.default.With("*").where(authorizationAfterPredicateReturn.predicate));
    }
    return mergeQuery;
}
function mergeStatement({ input, refNode, parentRefNode, context, relationField, parentNode, varName, callbackBucket, withVars, }) {
    const whereNodeParameters = getCypherParameters(input.where?.node, refNode);
    const onCreateNodeParameters = getCypherParameters(input.onCreate?.node, refNode);
    const autogeneratedParams = getAutogeneratedParams(refNode);
    const node = new cypher_builder_1.default.NamedNode(varName, {
        labels: refNode.getLabels(context),
    });
    const nodePattern = new cypher_builder_1.default.Pattern(node).withProperties(whereNodeParameters);
    const unsetAutogeneratedParams = (0, utils_1.omitFields)(autogeneratedParams, Object.keys(whereNodeParameters));
    const callbackFields = getCallbackFields(refNode);
    const callbackParams = callbackFields
        .map((callbackField) => {
        const varNameVariable = new cypher_builder_1.default.NamedVariable(varName);
        return (0, callback_utils_1.addCallbackAndSetParamCypher)(callbackField, varNameVariable, parentNode, callbackBucket, "CREATE", node);
    })
        .filter((tuple) => tuple.length !== 0);
    const rawNodeParams = {
        ...unsetAutogeneratedParams,
        ...onCreateNodeParameters,
    };
    const onCreateParams = Object.entries(rawNodeParams).map(([key, param]) => {
        return [node.property(key), param];
    });
    const merge = new cypher_builder_1.default.Merge(nodePattern).onCreate(...onCreateParams, ...callbackParams);
    const relationshipFields = context.relationships.find((x) => x.properties === relationField.properties);
    const autogeneratedRelationshipParams = relationshipFields ? getAutogeneratedParams(relationshipFields) : {};
    const rawOnCreateRelationshipParams = cypher_builder_1.default.utils.toCypherParams(input.onCreate?.edge || {});
    const rawRelationshipParams = {
        ...autogeneratedRelationshipParams,
        ...rawOnCreateRelationshipParams,
    };
    const relationship = new cypher_builder_1.default.Relationship({ type: relationField.type });
    const direction = (0, get_relationship_direction_1.getCypherRelationshipDirection)(relationField);
    const relationshipPattern = new cypher_builder_1.default.Pattern(parentNode)
        .related(relationship)
        .withDirection(direction)
        .to(node)
        .withoutLabels();
    const onCreateRelationshipParams = Object.entries(rawRelationshipParams).map(([key, param]) => {
        return [relationship.property(key), param];
    });
    const relationshipMerge = new cypher_builder_1.default.Merge(relationshipPattern).onCreate(...onCreateRelationshipParams);
    let withClause;
    if (context.subscriptionsEnabled) {
        const [fromTypename, toTypename] = relationField.direction === "IN" ? [refNode.name, parentRefNode.name] : [parentRefNode.name, refNode.name];
        const [fromNode, toNode] = relationField.direction === "IN" ? [node, parentNode] : [parentNode, node];
        withClause = new cypher_builder_1.default.RawCypher((env) => {
            const eventWithMetaStr = (0, create_connection_event_meta_1.createConnectionEventMeta)({
                event: "create_relationship",
                relVariable: (0, compile_cypher_1.compileCypher)(relationship, env),
                fromVariable: (0, compile_cypher_1.compileCypher)(fromNode, env),
                toVariable: (0, compile_cypher_1.compileCypher)(toNode, env),
                typename: relationField.typeUnescaped,
                fromTypename,
                toTypename,
            });
            return `WITH ${eventWithMetaStr}, ${(0, filter_meta_variable_1.filterMetaVariable)([...withVars, varName]).join(", ")}`;
        });
    }
    return cypher_builder_1.default.concat(merge, relationshipMerge, withClause);
}
function createAuthorizationBeforeConnectOrCreate({ context, sourceNode, sourceName, }) {
    const predicates = [];
    let subqueries;
    const sourceAuthorizationBefore = (0, create_authorization_before_predicate_1.createAuthorizationBeforePredicate)({
        context,
        nodes: [
            {
                node: sourceNode,
                variable: new cypher_builder_1.default.NamedNode(sourceName),
            },
        ],
        operations: ["CREATE_RELATIONSHIP"],
    });
    if (sourceAuthorizationBefore) {
        const { predicate, preComputedSubqueries } = sourceAuthorizationBefore;
        if (predicate) {
            predicates.push(predicate);
        }
        if (preComputedSubqueries) {
            subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
        }
    }
    return {
        predicate: cypher_builder_1.default.and(...predicates),
        preComputedSubqueries: subqueries,
    };
}
function createAuthorizationAfterConnectOrCreate({ context, sourceNode, sourceName, targetNode, targetName, }) {
    const predicates = [];
    let subqueries;
    const sourceAuthorizationAfter = (0, create_authorization_after_predicate_1.createAuthorizationAfterPredicate)({
        context,
        nodes: [
            {
                node: sourceNode,
                variable: new cypher_builder_1.default.NamedNode(sourceName),
            },
        ],
        operations: ["CREATE_RELATIONSHIP"],
    });
    const targetAuthorizationAfter = (0, create_authorization_after_predicate_1.createAuthorizationAfterPredicate)({
        context,
        nodes: [
            {
                node: targetNode,
                variable: new cypher_builder_1.default.NamedNode(targetName),
            },
        ],
        operations: ["CREATE_RELATIONSHIP", "CREATE"],
    });
    if (sourceAuthorizationAfter) {
        const { predicate, preComputedSubqueries } = sourceAuthorizationAfter;
        if (predicate) {
            predicates.push(predicate);
        }
        if (preComputedSubqueries) {
            subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
        }
    }
    if (targetAuthorizationAfter) {
        const { predicate, preComputedSubqueries } = targetAuthorizationAfter;
        if (predicate) {
            predicates.push(predicate);
        }
        if (preComputedSubqueries) {
            subqueries = cypher_builder_1.default.concat(subqueries, preComputedSubqueries);
        }
    }
    return {
        predicate: cypher_builder_1.default.and(...predicates),
        preComputedSubqueries: subqueries,
    };
}
function getCallbackFields(node) {
    const callbackFields = node.primitiveFields.filter((f) => f.callback);
    return callbackFields;
}
// Helper for compatibility reasons
function getAutogeneratedParams(node) {
    const autogeneratedFields = node.primitiveFields
        .filter((f) => f.autogenerate)
        .reduce((acc, field) => {
        if (field.dbPropertyName) {
            acc[field.dbPropertyName] = new cypher_builder_1.default.RawCypher("randomUUID()");
        }
        return acc;
    }, {});
    const autogeneratedTemporalFields = node.temporalFields
        .filter((field) => ["DateTime", "Time"].includes(field.typeMeta.name) && field.timestamps?.includes("CREATE"))
        .reduce((acc, field) => {
        if (field.dbPropertyName) {
            acc[field.dbPropertyName] = new cypher_builder_1.default.RawCypher(`${field.typeMeta.name.toLowerCase()}()`);
        }
        return acc;
    }, {});
    return { ...autogeneratedTemporalFields, ...autogeneratedFields };
}
function getCypherParameters(onCreateParams = {}, node) {
    const params = Object.entries(onCreateParams).reduce((acc, [key, value]) => {
        const nodeField = node?.constrainableFields.find((f) => f.fieldName === key);
        const nodeFieldName = nodeField?.dbPropertyNameUnescaped || nodeField?.fieldName;
        const fieldName = nodeFieldName || key;
        const valueOrArray = nodeField?.typeMeta.array ? (0, utils_1.asArray)(value) : value;
        acc[fieldName] = valueOrArray;
        return acc;
    }, {});
    return cypher_builder_1.default.utils.toCypherParams(params);
}
//# sourceMappingURL=create-connect-or-create-and-params.js.map