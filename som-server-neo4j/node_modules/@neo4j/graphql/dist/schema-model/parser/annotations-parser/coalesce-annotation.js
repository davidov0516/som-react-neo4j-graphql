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
exports.parseCoalesceAnnotation = void 0;
const CoalesceAnnotation_1 = require("../../annotation/CoalesceAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseCoalesceAnnotation(directive) {
    const args = (0, parse_arguments_1.parseArgumentsFromUnknownDirective)(directive);
    if (!args || args.value === undefined) {
        throw new Error("@coalesce directive must have a value");
    }
    return new CoalesceAnnotation_1.CoalesceAnnotation({
        value: args.value,
    });
}
exports.parseCoalesceAnnotation = parseCoalesceAnnotation;
//# sourceMappingURL=coalesce-annotation.js.map