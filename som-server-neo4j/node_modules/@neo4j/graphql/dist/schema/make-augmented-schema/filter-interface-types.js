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
exports.filterInterfaceTypes = void 0;
function filterInterfaceTypes(interfaceTypes, relationshipPropertyInterfaceNames, interfaceRelationshipNames) {
    const relationshipProperties = [];
    const interfaceRelationships = [];
    const filteredInterfaceTypes = [];
    for (const interfaceType of interfaceTypes) {
        if (relationshipPropertyInterfaceNames.has(interfaceType.name.value)) {
            relationshipProperties.push(interfaceType);
        }
        else if (interfaceRelationshipNames.has(interfaceType.name.value)) {
            interfaceRelationships.push(interfaceType);
        }
        else {
            filteredInterfaceTypes.push(interfaceType);
        }
    }
    return {
        relationshipProperties,
        interfaceRelationships,
        filteredInterfaceTypes,
    };
}
exports.filterInterfaceTypes = filterInterfaceTypes;
//# sourceMappingURL=filter-interface-types.js.map