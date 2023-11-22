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
exports.GraphElement = void 0;
class GraphElement {
    constructor(input) {
        this.name = input.name;
        this.description = input.description;
        this.primitiveFields = input.primitiveFields;
        this.scalarFields = input.scalarFields;
        this.enumFields = input.enumFields;
        this.temporalFields = input.temporalFields;
        this.pointFields = input.pointFields;
        this.customResolverFields = input.customResolverFields;
    }
    getField(name) {
        for (const fieldList of this.getAllFields()) {
            const field = this.searchFieldInList(name, fieldList);
            if (field)
                return field;
        }
    }
    getAllFields() {
        return [
            this.primitiveFields,
            this.scalarFields,
            this.enumFields,
            this.temporalFields,
            this.pointFields,
            this.customResolverFields,
        ];
    }
    searchFieldInList(fieldName, fields) {
        return fields.find((field) => {
            return field.fieldName === fieldName;
        });
    }
}
exports.GraphElement = GraphElement;
//# sourceMappingURL=GraphElement.js.map