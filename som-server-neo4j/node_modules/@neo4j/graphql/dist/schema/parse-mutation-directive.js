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
const MutationDirective_1 = require("../classes/MutationDirective");
const mutation_1 = require("../graphql/directives/mutation");
const parse_arguments_1 = require("../schema-model/parser/parse-arguments");
function parseMutationDirective(directiveNode) {
    if (!directiveNode || directiveNode.name.value !== mutation_1.mutationDirective.name) {
        throw new Error("Undefined or incorrect directive passed into parseMutationDirective function");
    }
    const arg = (0, parse_arguments_1.parseArguments)(mutation_1.mutationDirective, directiveNode);
    return new MutationDirective_1.MutationDirective(arg.operations);
}
exports.default = parseMutationDirective;
//# sourceMappingURL=parse-mutation-directive.js.map