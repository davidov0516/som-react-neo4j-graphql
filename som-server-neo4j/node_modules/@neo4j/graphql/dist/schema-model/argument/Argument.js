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
exports.Argument = void 0;
const parse_value_node_1 = require("../parser/parse-value-node");
class Argument {
    // Arguments can have annotations but we don't seem to use this feature
    // public readonly annotations: Partial<Annotations> = {};
    constructor({ name, type, defaultValue, description, }) {
        this.name = name;
        this.type = type;
        this.defaultValue = defaultValue ? (0, parse_value_node_1.parseValueNode)(defaultValue) : undefined;
        this.description = description;
    }
}
exports.Argument = Argument;
//# sourceMappingURL=Argument.js.map