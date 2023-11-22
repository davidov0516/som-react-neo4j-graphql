"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definitionsEnricher = void 0;
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
const graphql_1 = require("graphql");
const utils_1 = require("./utils");
function findDirectiveByTypeName(typeName, enricherContext, directiveName) {
    const userDocumentObject = enricherContext.userDefinitionNodeMap[typeName];
    const userDocumentExtensions = enricherContext.userDefinitionNodeMap[`${userDocumentObject?.name.value}_EXTENSIONS`];
    if ((userDocumentObject && (0, utils_1.containsDirective)(userDocumentObject, directiveName)) ||
        (userDocumentExtensions && userDocumentExtensions.find((e) => (0, utils_1.containsDirective)(e, directiveName)))) {
        return true;
    }
    return false;
}
// Enriches the directive definition itself
function definitionsEnricher(enricherContext, directiveName, createDefinitionFn) {
    return (accumulatedDefinitions, definition) => {
        switch (definition.kind) {
            case graphql_1.Kind.INTERFACE_TYPE_DEFINITION:
            case graphql_1.Kind.OBJECT_TYPE_DEFINITION: {
                const typeName = definition.name.value;
                const hasDirective = findDirectiveByTypeName(typeName, enricherContext, directiveName);
                if (hasDirective) {
                    const definitions = createDefinitionFn(typeName, enricherContext.augmentedSchema);
                    accumulatedDefinitions.push(...definitions);
                }
            }
        }
        accumulatedDefinitions.push(definition);
        return accumulatedDefinitions;
    };
}
exports.definitionsEnricher = definitionsEnricher;
//# sourceMappingURL=definitions.js.map