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
const graphql_1 = require("graphql");
const classes_1 = require("../classes");
function parseExcludeDirective(excludeDirective) {
    if (!excludeDirective || excludeDirective.name.value !== "exclude") {
        throw new Error("Undefined or incorrect directive passed into parseExcludeDirective function");
    }
    const allResolvers = ["create", "read", "update", "delete", "subscribe"];
    if (!excludeDirective.arguments?.length) {
        return new classes_1.Exclude({ operations: allResolvers });
    }
    const operations = excludeDirective.arguments?.find((a) => a.name.value === "operations");
    const argumentValue = (0, graphql_1.valueFromASTUntyped)(operations.value);
    const result = argumentValue.map((val) => val.toLowerCase());
    return new classes_1.Exclude({ operations: result });
}
exports.default = parseExcludeDirective;
//# sourceMappingURL=parse-exclude-directive.js.map