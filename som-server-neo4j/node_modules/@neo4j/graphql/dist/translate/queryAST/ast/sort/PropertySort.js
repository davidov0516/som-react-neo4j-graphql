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
exports.PropertySort = void 0;
const Sort_1 = require("./Sort");
class PropertySort extends Sort_1.Sort {
    constructor({ attribute, direction }) {
        super();
        this.attribute = attribute;
        this.direction = direction;
    }
    getChildren() {
        return [];
    }
    print() {
        return `${super.print()} <${this.attribute.name}>`;
    }
    getSortFields(context, variable, sortByDatabaseName = true) {
        const attributeName = sortByDatabaseName ? this.attribute.databaseName : this.attribute.name;
        const nodeProperty = variable.property(attributeName);
        return [[nodeProperty, this.direction]];
    }
    getProjectionField(_context) {
        if (this.attribute.databaseName !== this.attribute.name)
            return {};
        return this.attribute.databaseName;
    }
}
exports.PropertySort = PropertySort;
//# sourceMappingURL=PropertySort.js.map