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
exports.parseLimitAnnotation = void 0;
const classes_1 = require("../../../classes");
const directives_1 = require("../../../graphql/directives");
const LimitAnnotation_1 = require("../../annotation/LimitAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseLimitAnnotation(directive) {
    const { default: _default, max } = (0, parse_arguments_1.parseArguments)(directives_1.limitDirective, directive);
    if (_default && typeof _default !== "number") {
        throw new classes_1.Neo4jGraphQLSchemaValidationError(`@limit default must be a number`);
    }
    if (max && typeof max !== "number") {
        throw new classes_1.Neo4jGraphQLSchemaValidationError(`@limit max must be a number`);
    }
    return new LimitAnnotation_1.LimitAnnotation({
        default: _default,
        max,
    });
}
exports.parseLimitAnnotation = parseLimitAnnotation;
//# sourceMappingURL=limit-annotation.js.map