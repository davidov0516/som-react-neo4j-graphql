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
exports.NodeDirective = void 0;
const Error_1 = require("./Error");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const map_labels_with_context_1 = require("../schema-model/utils/map-labels-with-context");
class NodeDirective {
    constructor(input) {
        this.labels = input.labels || [];
    }
    getLabelsString(typeName, context) {
        if (!typeName) {
            throw new Error_1.Neo4jGraphQLError("Could not generate label string in @node directive due to empty typeName");
        }
        const labels = this.getLabels(typeName, context).map((label) => cypher_builder_1.default.utils.escapeLabel(label));
        return `:${labels.join(":")}`;
    }
    /**
     * Returns the list containing labels mapped with the values contained in the Context.
     * Be careful when using this method, labels returned are unescaped.
     **/
    getLabels(typeName, context) {
        const labels = !this.labels.length ? [typeName] : this.labels;
        return (0, map_labels_with_context_1.mapLabelsWithContext)(labels, context);
    }
}
exports.NodeDirective = NodeDirective;
//# sourceMappingURL=NodeDirective.js.map