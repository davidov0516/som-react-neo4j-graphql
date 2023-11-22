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
exports.getDefinitionCollection = void 0;
const graphql_1 = require("graphql");
const directives_1 = require("../../graphql/directives");
const is_root_type_1 = require("../../utils/is-root-type");
const utils_1 = require("./utils");
function getDefinitionCollection(document) {
    return document.definitions.reduce((definitionCollection, definition) => {
        switch (definition.kind) {
            case graphql_1.Kind.SCALAR_TYPE_DEFINITION:
                definitionCollection.scalarTypes.set(definition.name.value, definition);
                break;
            case graphql_1.Kind.OBJECT_TYPE_DEFINITION:
                if ((0, utils_1.findDirective)(definition.directives, directives_1.jwt.name)) {
                    definitionCollection.jwtPayload = definition;
                }
                else if (!(0, is_root_type_1.isRootType)(definition)) {
                    definitionCollection.nodes.set(definition.name.value, definition);
                }
                else {
                    definitionCollection.operations.push(definition);
                }
                break;
            case graphql_1.Kind.ENUM_TYPE_DEFINITION:
                definitionCollection.enumTypes.set(definition.name.value, definition);
                break;
            case graphql_1.Kind.INTERFACE_TYPE_DEFINITION:
                if ((0, utils_1.findDirective)(definition.directives, directives_1.relationshipPropertiesDirective.name)) {
                    definitionCollection.relationshipProperties.set(definition.name.value, definition);
                }
                else {
                    definitionCollection.interfaceTypes.set(definition.name.value, definition);
                    definitionCollection.interfaceToImplementingTypeNamesMap.set(definition.name.value, []); // previous initInterfacesToTypeNamesMap logic.
                }
                break;
            case graphql_1.Kind.DIRECTIVE_DEFINITION:
                definitionCollection.directives.set(definition.name.value, definition);
                break;
            case graphql_1.Kind.UNION_TYPE_DEFINITION:
                definitionCollection.unionTypes.set(definition.name.value, definition);
                break;
            case graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION:
                definitionCollection.inputTypes.set(definition.name.value, definition);
                break;
            case graphql_1.Kind.SCHEMA_EXTENSION:
                // This is based on the assumption that mergeTypeDefs is used and therefore there is only one schema extension (merged), this assumption is currently used as well for object extensions.
                definitionCollection.schemaExtension = definition;
                definitionCollection.schemaDirectives = definition.directives
                    ? Array.from(definition.directives)
                    : [];
                break;
        }
        return definitionCollection;
    }, {
        nodes: new Map(),
        enumTypes: new Map(),
        scalarTypes: new Map(),
        interfaceTypes: new Map(),
        directives: new Map(),
        unionTypes: new Map(),
        relationshipProperties: new Map(),
        inputTypes: new Map(),
        schemaExtension: undefined,
        jwtPayload: undefined,
        interfaceToImplementingTypeNamesMap: new Map(),
        operations: [],
        schemaDirectives: [],
        document,
    });
}
exports.getDefinitionCollection = getDefinitionCollection;
//# sourceMappingURL=definition-collection.js.map