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
exports.Subgraph = void 0;
const subgraph_1 = require("@apollo/subgraph");
const merge_1 = require("@graphql-tools/merge");
const graphql_1 = require("graphql");
const translate_resolve_reference_1 = require("../translate/translate-resolve-reference");
const utils_1 = require("../utils");
const get_neo4j_resolve_tree_1 = __importDefault(require("../utils/get-neo4j-resolve-tree"));
const is_in_array_1 = require("../utils/is-in-array");
// TODO fetch the directive names from the spec
const federationDirectiveNames = [
    "key",
    "extends",
    "shareable",
    "inaccessible",
    "override",
    "external",
    "provides",
    "requires",
    "tag",
    "composeDirective",
    "interfaceObject",
];
class Subgraph {
    constructor(typeDefs) {
        this.typeDefs = typeDefs;
        this.importArgument = new Map([
            ["key", "federation__key"],
            ["extends", "federation__extends"],
            ["shareable", "federation__shareable"],
            ["inaccessible", "federation__inaccessible"],
            ["override", "federation__override"],
            ["external", "federation__external"],
            ["provides", "federation__provides"],
            ["requires", "federation__requires"],
            ["tag", "federation__tag"],
            ["composeDirective", "federation__composeDirective"],
            ["interfaceObject", "federation__interfaceObject"],
        ]);
        const linkMeta = this.findFederationLinkMeta(typeDefs);
        if (!linkMeta) {
            throw new Error(`typeDefs must contain \`@link\` schema extension to be used with Apollo Federation`);
        }
        const { extension, directive: linkDirective } = linkMeta;
        this.linkExtension = extension;
        this.parseLinkImportArgument(linkDirective);
    }
    getFullyQualifiedDirectiveName(name) {
        return this.importArgument.get(name);
    }
    buildSchema({ typeDefs, resolvers }) {
        return (0, subgraph_1.buildSubgraphSchema)({
            typeDefs,
            resolvers,
        });
    }
    getReferenceResolvers(nodes, schemaModel) {
        const resolverMap = {};
        const document = (0, merge_1.mergeTypeDefs)(this.typeDefs);
        document.definitions.forEach((def) => {
            if (def.kind === graphql_1.Kind.OBJECT_TYPE_DEFINITION) {
                const entity = schemaModel.getEntity(def.name.value);
                if (entity?.isConcreteEntity()) {
                    const keyAnnotation = entity.annotations.key;
                    // If there is a @key directive with `resolvable` set to false, then do not add __resolveReference
                    if (keyAnnotation && keyAnnotation.resolvable === false) {
                        return;
                    }
                }
                resolverMap[def.name.value] = {
                    __resolveReference: this.getReferenceResolver(nodes),
                };
            }
        });
        return resolverMap;
    }
    getReferenceResolver(nodes) {
        const __resolveReference = async (reference, context, info) => {
            const { __typename } = reference;
            const node = nodes.find((n) => n.name === __typename);
            if (!node) {
                throw new Error("Unable to find matching node");
            }
            context.resolveTree = (0, get_neo4j_resolve_tree_1.default)(info);
            const { cypher, params } = (0, translate_resolve_reference_1.translateResolveReference)({
                context: context,
                node,
                reference,
            });
            const executeResult = await (0, utils_1.execute)({
                cypher,
                params,
                defaultAccessMode: "READ",
                context,
                info,
            });
            return executeResult.records[0]?.this;
        };
        return __resolveReference;
    }
    getValidationDefinitions() {
        const document = (0, graphql_1.parse)((0, graphql_1.print)(this.linkExtension));
        const schema = (0, subgraph_1.buildSubgraphSchema)({ typeDefs: document });
        const config = schema.toConfig();
        const directives = config.directives;
        const types = config.types;
        const enums = types.filter((t) => t.astNode?.kind === graphql_1.Kind.ENUM_TYPE_DEFINITION);
        const scalars = types.filter((t) => t.astNode?.kind === graphql_1.Kind.SCALAR_TYPE_DEFINITION);
        return {
            directives: [...directives],
            types: [...enums, ...scalars],
        };
    }
    findFederationLinkMeta(typeDefs) {
        const document = (0, merge_1.mergeTypeDefs)(typeDefs);
        for (const definition of document.definitions) {
            if (definition.kind === graphql_1.Kind.SCHEMA_EXTENSION && definition.directives) {
                for (const directive of definition.directives) {
                    if (directive.name.value === "link" && directive.arguments) {
                        for (const argument of directive.arguments) {
                            if (argument.name.value === "url" && argument.value.kind === graphql_1.Kind.STRING) {
                                const url = argument.value.value;
                                if (url.startsWith("https://specs.apollo.dev/federation/v2")) {
                                    // Remove any other directives and operations from the extension
                                    // We only care for the `@link` directive
                                    const extensionWithLinkOnly = {
                                        ...definition,
                                        directives: definition.directives.filter((d) => d.name.value === "link"),
                                        operationTypes: [],
                                    };
                                    return { extension: extensionWithLinkOnly, directive };
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    trimDirectiveName(name) {
        return name.replace("@", "");
    }
    parseLinkImportArgument(directive) {
        const argument = directive.arguments?.find((arg) => arg.name.value === "import");
        if (argument) {
            if (argument.value.kind === graphql_1.Kind.LIST) {
                for (const value of argument.value.values) {
                    if (value.kind === graphql_1.Kind.STRING) {
                        const trimmedName = this.trimDirectiveName(value.value);
                        if (!(0, is_in_array_1.isInArray)(federationDirectiveNames, trimmedName)) {
                            throw new Error(`Encountered unknown Apollo Federation directive ${value.value}`);
                        }
                        this.importArgument.set(trimmedName, trimmedName);
                    }
                    if (value.kind === graphql_1.Kind.OBJECT) {
                        const name = value.fields.find((f) => f.name.value === "name");
                        const as = value.fields.find((f) => f.name.value === "as");
                        if (name?.value.kind === graphql_1.Kind.STRING) {
                            const trimmedName = this.trimDirectiveName(name.value.value);
                            if (!(0, is_in_array_1.isInArray)(federationDirectiveNames, trimmedName)) {
                                throw new Error(`Encountered unknown Apollo Federation directive ${name.value.value}`);
                            }
                            if (as?.value.kind !== graphql_1.Kind.STRING) {
                                throw new Error(`Alias for directive ${name.value.value} is not of type string`);
                            }
                            this.importArgument.set(trimmedName, this.trimDirectiveName(as.value.value));
                        }
                    }
                }
            }
        }
    }
}
exports.Subgraph = Subgraph;
//# sourceMappingURL=Subgraph.js.map