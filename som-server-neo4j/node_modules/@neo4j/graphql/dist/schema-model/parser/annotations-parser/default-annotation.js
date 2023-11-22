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
exports.parseDefaultAnnotation = void 0;
const DefaultAnnotation_1 = require("../../annotation/DefaultAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseDefaultAnnotation(directive) {
    const args = (0, parse_arguments_1.parseArgumentsFromUnknownDirective)(directive);
    if (args.value === undefined) {
        throw new Error("@default directive must have a value");
    }
    return new DefaultAnnotation_1.DefaultAnnotation({
        value: args.value,
    });
}
exports.parseDefaultAnnotation = parseDefaultAnnotation;
//# sourceMappingURL=default-annotation.js.map