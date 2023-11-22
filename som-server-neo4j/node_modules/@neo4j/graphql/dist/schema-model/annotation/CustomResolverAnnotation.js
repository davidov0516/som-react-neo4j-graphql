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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomResolverAnnotation = void 0;
const graphql_1 = require("graphql");
const get_custom_resolver_meta_1 = require("../../schema/get-custom-resolver-meta");
const get_definition_nodes_1 = require("../../schema/get-definition-nodes");
class CustomResolverAnnotation {
    constructor({ requires }) {
        this.requires = requires;
    }
    parseRequire(document, objectFields) {
        if (!this.requires) {
            return;
        }
        const definitionNodes = (0, get_definition_nodes_1.getDefinitionNodes)(document);
        const { interfaceTypes, objectTypes, unionTypes } = definitionNodes;
        const selectionSetDocument = (0, graphql_1.parse)(`{ ${this.requires} }`);
        this.parsedRequires = (0, get_custom_resolver_meta_1.selectionSetToResolveTree)(objectFields || [], objectTypes, interfaceTypes, unionTypes, selectionSetDocument);
    }
}
exports.CustomResolverAnnotation = CustomResolverAnnotation;
//# sourceMappingURL=CustomResolverAnnotation.js.map