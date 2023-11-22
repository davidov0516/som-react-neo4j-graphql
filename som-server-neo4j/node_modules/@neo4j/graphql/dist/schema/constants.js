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
exports.DEPRECATE_INVALID_AGGREGATION_FILTERS = exports.DEPRECATE_IMPLICIT_LENGTH_AGGREGATION_FILTERS = exports.DEPRECATE_NOT = void 0;
const constants_1 = require("../constants");
exports.DEPRECATE_NOT = {
    name: constants_1.DEPRECATED,
    args: {
        reason: "Negation filters will be deprecated, use the NOT operator to achieve the same behavior",
    },
};
exports.DEPRECATE_IMPLICIT_LENGTH_AGGREGATION_FILTERS = {
    name: constants_1.DEPRECATED,
    args: {
        reason: "Please use the explicit _LENGTH version for string aggregation.",
    },
};
exports.DEPRECATE_INVALID_AGGREGATION_FILTERS = {
    name: constants_1.DEPRECATED,
    args: {
        reason: "Aggregation filters that are not relying on an aggregating function will be deprecated.",
    },
};
//# sourceMappingURL=constants.js.map