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
exports.getDefinitionNodes = void 0;
const debug_1 = __importDefault(require("debug"));
const graphql_1 = require("graphql");
const is_root_type_1 = require("../utils/is-root-type");
const constants_1 = require("../constants");
const debug = (0, debug_1.default)(constants_1.DEBUG_GENERATE);
function getDefinitionNodes(document) {
    return document.definitions.reduce((definitionNodes, definition) => {
        switch (definition.kind) {
            case graphql_1.Kind.SCALAR_TYPE_DEFINITION:
                definitionNodes.scalarTypes.push(definition);
                break;
            case graphql_1.Kind.OBJECT_TYPE_DEFINITION:
                if (!(0, is_root_type_1.isRootType)(definition)) {
                    definitionNodes.objectTypes.push(definition);
                }
                else {
                    definitionNodes.operations.push(definition);
                }
                break;
            case graphql_1.Kind.ENUM_TYPE_DEFINITION:
                definitionNodes.enumTypes.push(definition);
                break;
            case graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION:
                definitionNodes.inputObjectTypes.push(definition);
                break;
            case graphql_1.Kind.INTERFACE_TYPE_DEFINITION:
                definitionNodes.interfaceTypes.push(definition);
                break;
            case graphql_1.Kind.DIRECTIVE_DEFINITION:
                definitionNodes.directives.push(definition);
                break;
            case graphql_1.Kind.UNION_TYPE_DEFINITION:
                definitionNodes.unionTypes.push(definition);
                break;
            case graphql_1.Kind.SCHEMA_EXTENSION:
                definitionNodes.schemaExtensions.push(definition);
                break;
            case graphql_1.Kind.SCHEMA_DEFINITION:
                break;
            default:
                debug(`Ignoring definition kind ${definition.kind}`);
        }
        return definitionNodes;
    }, {
        objectTypes: [],
        inputObjectTypes: [],
        enumTypes: [],
        scalarTypes: [],
        interfaceTypes: [],
        directives: [],
        unionTypes: [],
        schemaExtensions: [],
        operations: [],
    });
}
exports.getDefinitionNodes = getDefinitionNodes;
//# sourceMappingURL=get-definition-nodes.js.map