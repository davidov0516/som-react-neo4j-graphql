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
exports.WarnIfListOfListsFieldDefinition = void 0;
const graphql_1 = require("graphql");
function WarnIfListOfListsFieldDefinition() {
    let warningAlreadyIssued = false;
    return {
        FieldDefinition(field) {
            if (!warningAlreadyIssued) {
                const listTypeNode = getListTypeNode(field);
                if (listTypeNode) {
                    if (getListTypeNode(listTypeNode)) {
                        console.warn("Encountered list field definition(s) with list elements. This is not supported by Neo4j, however, you can ignore this warning if the field is only used in the result of custom resolver/Cypher.");
                        warningAlreadyIssued = true;
                    }
                }
            }
        },
    };
}
exports.WarnIfListOfListsFieldDefinition = WarnIfListOfListsFieldDefinition;
function getListTypeNode(definition) {
    if (definition.type.kind === graphql_1.Kind.NON_NULL_TYPE) {
        return getListTypeNode(definition.type);
    }
    if (definition.type.kind === graphql_1.Kind.LIST_TYPE) {
        return definition.type;
    }
    return;
}
//# sourceMappingURL=list-of-lists.js.map