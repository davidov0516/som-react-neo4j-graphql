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
exports.getInheritedTypeNames = exports.hydrateInterfaceWithImplementedTypesMap = void 0;
const graphql_1 = require("graphql");
function hydrateInterfaceWithImplementedTypesMap(node, interfaceToImplementingTypes) {
    if (node?.kind !== graphql_1.Kind.OBJECT_TYPE_DEFINITION && node?.kind !== graphql_1.Kind.OBJECT_TYPE_EXTENSION) {
        return;
    }
    for (const i of node.interfaces || []) {
        const implementingTypes = interfaceToImplementingTypes.get(i.name.value) || new Set();
        interfaceToImplementingTypes.set(i.name.value, implementingTypes.add(node.name.value));
    }
}
exports.hydrateInterfaceWithImplementedTypesMap = hydrateInterfaceWithImplementedTypesMap;
function getInheritedTypeNames(mainType, interfaceToImplementingTypes) {
    if (mainType.kind === graphql_1.Kind.INTERFACE_TYPE_DEFINITION || mainType.kind === graphql_1.Kind.INTERFACE_TYPE_EXTENSION) {
        return Array.from(interfaceToImplementingTypes.get(mainType.name.value)?.values() || []);
    }
    if (mainType.kind === graphql_1.Kind.OBJECT_TYPE_DEFINITION || mainType.kind === graphql_1.Kind.OBJECT_TYPE_EXTENSION) {
        return (mainType.interfaces || []).map((i) => i.name.value);
    }
    return [];
}
exports.getInheritedTypeNames = getInheritedTypeNames;
//# sourceMappingURL=interface-to-implementing-types.js.map