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
exports.OperationAdapter = void 0;
const AttributeAdapter_1 = require("./attribute/model-adapters/AttributeAdapter");
class OperationAdapter {
    constructor(entity) {
        this.attributes = new Map();
        this.annotations = {};
        this.name = entity.name;
        this.initAttributes(entity.attributes);
        this.annotations = entity.annotations;
    }
    initAttributes(attributes) {
        for (const [attributeName, attribute] of attributes.entries()) {
            const attributeAdapter = new AttributeAdapter_1.AttributeAdapter(attribute);
            this.attributes.set(attributeName, attributeAdapter);
        }
    }
    get objectFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isObjectField());
    }
}
exports.OperationAdapter = OperationAdapter;
//# sourceMappingURL=OperationAdapter.js.map