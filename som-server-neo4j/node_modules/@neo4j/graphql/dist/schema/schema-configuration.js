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
exports.getSchemaConfigurationFlags = exports.schemaConfigurationFromObjectTypeDefinition = exports.schemaConfigurationFromSchemaExtensions = void 0;
const directives_1 = require("../graphql/directives");
const parse_mutation_directive_1 = __importDefault(require("./parse-mutation-directive"));
const parse_query_directive_1 = __importDefault(require("./parse-query-directive"));
const parse_subscription_directive_1 = __importDefault(require("./parse-subscription-directive"));
// obtain a schema configuration object from a list of SchemaExtensionNode
function schemaConfigurationFromSchemaExtensions(schemaExtensions) {
    const schemaConfiguration = {};
    for (const schemaExtension of schemaExtensions) {
        for (const directive of schemaExtension.directives || []) {
            if (directive.name.value === directives_1.queryDirective.name) {
                if (schemaConfiguration.queryDirective) {
                    throw new Error(`Ambiguous usage with the directive named: ${directives_1.queryDirective.name}`);
                }
                schemaConfiguration.queryDirective = (0, parse_query_directive_1.default)(directive);
            }
            if (directive.name.value === directives_1.mutationDirective.name) {
                if (schemaConfiguration.mutationDirective) {
                    throw new Error(`Ambiguity usage with the directive named: ${directives_1.queryDirective.name}`);
                }
                schemaConfiguration.mutationDirective = (0, parse_mutation_directive_1.default)(directive);
            }
            if (directive.name.value === directives_1.subscriptionDirective.name) {
                if (schemaConfiguration.subscriptionDirective) {
                    throw new Error(`Ambiguous usage with the directive named: ${directives_1.queryDirective.name}`);
                }
                schemaConfiguration.subscriptionDirective = (0, parse_subscription_directive_1.default)(directive);
            }
        }
    }
    return schemaConfiguration;
}
exports.schemaConfigurationFromSchemaExtensions = schemaConfigurationFromSchemaExtensions;
// obtain a schema configuration object from a ObjectTypeDefinition
function schemaConfigurationFromObjectTypeDefinition(definition) {
    const schemaConfiguration = {};
    for (const directive of definition.directives || []) {
        if (directive.name.value === directives_1.queryDirective.name) {
            schemaConfiguration.queryDirective = (0, parse_query_directive_1.default)(directive);
        }
        if (directive.name.value === directives_1.mutationDirective.name) {
            schemaConfiguration.mutationDirective = (0, parse_mutation_directive_1.default)(directive);
        }
        if (directive.name.value === directives_1.subscriptionDirective.name) {
            schemaConfiguration.subscriptionDirective = (0, parse_subscription_directive_1.default)(directive);
        }
    }
    return schemaConfiguration;
}
exports.schemaConfigurationFromObjectTypeDefinition = schemaConfigurationFromObjectTypeDefinition;
// takes the directives that may mutate the output schema and returns a SchemaConfigurationFlags object
function getSchemaConfigurationFlags(options) {
    // avoid mixing between the exclude directive and the new schema configurations one
    if (options.excludeDirective &&
        (options.globalSchemaConfiguration?.queryDirective ||
            options.nodeSchemaConfiguration?.queryDirective ||
            options.globalSchemaConfiguration?.mutationDirective ||
            options.nodeSchemaConfiguration?.mutationDirective)) {
        throw new Error("@exclude directive is a deprecated directive and cannot be used in conjunction with @query, @mutation, @subscription");
    }
    // avoid mixing configurations on both schema and object
    if (options.globalSchemaConfiguration?.queryDirective && options.nodeSchemaConfiguration?.queryDirective) {
        throw new Error("@query directive already defined at the schema location");
    }
    if (options.globalSchemaConfiguration?.mutationDirective && options.nodeSchemaConfiguration?.mutationDirective) {
        throw new Error("@mutation directive already defined at the schema location");
    }
    if (options.globalSchemaConfiguration?.subscriptionDirective &&
        options.nodeSchemaConfiguration?.subscriptionDirective) {
        throw new Error("@subscription directive already defined at the schema location");
    }
    const schemaConfigurationFlags = {
        read: true,
        aggregate: true,
        create: true,
        delete: true,
        update: true,
        subscribeCreate: true,
        subscribeUpdate: true,
        subscribeDelete: true,
        subscribeCreateRelationship: true,
        subscribeDeleteRelationship: true,
    };
    if (options.excludeDirective) {
        const excludeOperationsSet = new Set(options.excludeDirective.operations);
        schemaConfigurationFlags.read = schemaConfigurationFlags.aggregate = !excludeOperationsSet.has("read");
        schemaConfigurationFlags.create = !excludeOperationsSet.has("create");
        schemaConfigurationFlags.delete = !excludeOperationsSet.has("delete");
        schemaConfigurationFlags.update = !excludeOperationsSet.has("update");
    }
    const queryDirective = options.nodeSchemaConfiguration?.queryDirective || options.globalSchemaConfiguration?.queryDirective;
    const mutationDirective = options.nodeSchemaConfiguration?.mutationDirective || options.globalSchemaConfiguration?.mutationDirective;
    const subscriptionDirective = options.globalSchemaConfiguration?.subscriptionDirective ||
        options.nodeSchemaConfiguration?.subscriptionDirective;
    if (queryDirective) {
        schemaConfigurationFlags.read = queryDirective.read;
        schemaConfigurationFlags.aggregate = queryDirective.aggregate;
    }
    if (mutationDirective) {
        schemaConfigurationFlags.create = mutationDirective.create;
        schemaConfigurationFlags.update = mutationDirective.update;
        schemaConfigurationFlags.delete = mutationDirective.delete;
    }
    if (subscriptionDirective) {
        schemaConfigurationFlags.subscribeCreate = subscriptionDirective.created;
        schemaConfigurationFlags.subscribeUpdate = subscriptionDirective.updated;
        schemaConfigurationFlags.subscribeDelete = subscriptionDirective.deleted;
        schemaConfigurationFlags.subscribeCreateRelationship = subscriptionDirective.relationshipCreated;
        schemaConfigurationFlags.subscribeDeleteRelationship = subscriptionDirective.relationshipDeleted;
    }
    return schemaConfigurationFlags;
}
exports.getSchemaConfigurationFlags = getSchemaConfigurationFlags;
//# sourceMappingURL=schema-configuration.js.map