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
exports.addDirectedArgument = exports.getDirectedArgument = void 0;
const constants_1 = require("../constants");
function getDirectedArgument(relationshipAdapter) {
    let defaultValue;
    switch (relationshipAdapter.queryDirection) {
        case constants_1.RelationshipQueryDirectionOption.DEFAULT_DIRECTED:
            defaultValue = true;
            break;
        case constants_1.RelationshipQueryDirectionOption.DEFAULT_UNDIRECTED:
            defaultValue = false;
            break;
        case constants_1.RelationshipQueryDirectionOption.DIRECTED_ONLY:
        case constants_1.RelationshipQueryDirectionOption.UNDIRECTED_ONLY:
        default:
            return undefined;
    }
    return {
        type: "Boolean",
        defaultValue,
    };
}
exports.getDirectedArgument = getDirectedArgument;
function addDirectedArgument(args, relationshipAdapter) {
    const directedArg = getDirectedArgument(relationshipAdapter);
    if (directedArg) {
        return { ...args, directed: directedArg };
    }
    return { ...args };
}
exports.addDirectedArgument = addDirectedArgument;
//# sourceMappingURL=directed-argument.js.map