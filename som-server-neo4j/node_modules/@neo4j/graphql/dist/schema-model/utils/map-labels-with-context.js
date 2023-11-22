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
exports.mapLabelsWithContext = void 0;
const dot_prop_1 = __importDefault(require("dot-prop"));
/**
 * Given a list of strings, representing labels, and a context, replace any labels that start with $ with the value from the context
 **/
function mapLabelsWithContext(labels, context) {
    return labels.map((label) => {
        if (label.startsWith("$")) {
            // Trim $context. OR $ off the beginning of the string
            const path = label.substring(label.startsWith("$context") ? 9 : 1);
            const labelValue = searchLabel(context, path);
            if (!labelValue) {
                throw new Error(`Label value not found in context.`);
            }
            return labelValue;
        }
        return label;
    });
}
exports.mapLabelsWithContext = mapLabelsWithContext;
function searchLabel(context, path) {
    // Search for the key at the root of the context
    let labelValue = dot_prop_1.default.get(context, path);
    if (!labelValue) {
        // Search for the key in cypherParams
        labelValue = dot_prop_1.default.get(context.cypherParams, path);
    }
    return labelValue;
}
//# sourceMappingURL=map-labels-with-context.js.map