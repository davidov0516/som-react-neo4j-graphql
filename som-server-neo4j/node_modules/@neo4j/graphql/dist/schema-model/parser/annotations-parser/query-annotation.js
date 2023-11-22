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
exports.parseQueryAnnotation = void 0;
const directives_1 = require("../../../graphql/directives");
const QueryAnnotation_1 = require("../../annotation/QueryAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseQueryAnnotation(directive) {
    const { read, aggregate } = (0, parse_arguments_1.parseArguments)(directives_1.queryDirective, directive);
    return new QueryAnnotation_1.QueryAnnotation({
        read,
        aggregate,
    });
}
exports.parseQueryAnnotation = parseQueryAnnotation;
//# sourceMappingURL=query-annotation.js.map