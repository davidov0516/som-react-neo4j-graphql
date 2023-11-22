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
exports.getFilteringFn = void 0;
const operatorCheckMap = {
    NOT: (received, filtered) => received !== filtered,
    LT: (received, filtered) => {
        const parsed = typeof received === "string" ? BigInt(received) : received;
        return parsed < filtered;
    },
    LTE: (received, filtered) => {
        const parsed = typeof received === "string" ? BigInt(received) : received;
        return parsed <= filtered;
    },
    GT: (received, filtered) => {
        const parsed = typeof received === "string" ? BigInt(received) : received;
        return parsed > filtered;
    },
    GTE: (received, filtered) => {
        const parsed = typeof received === "string" ? BigInt(received) : received;
        return parsed >= filtered;
    },
    STARTS_WITH: (received, filtered) => received.startsWith(filtered),
    NOT_STARTS_WITH: (received, filtered) => !received.startsWith(filtered),
    ENDS_WITH: (received, filtered) => received.endsWith(filtered),
    NOT_ENDS_WITH: (received, filtered) => !received.endsWith(filtered),
    CONTAINS: (received, filtered) => received.includes(filtered),
    NOT_CONTAINS: (received, filtered) => !received.includes(filtered),
    INCLUDES: (received, filtered) => {
        return received.some((v) => v === filtered);
    },
    NOT_INCLUDES: (received, filtered) => {
        return !received.some((v) => v === filtered);
    },
    IN: (received, filtered) => {
        return filtered.some((v) => v === received);
    },
    NOT_IN: (received, filtered) => {
        return !filtered.some((v) => v === received);
    },
};
function getFilteringFn(operator, overrides) {
    if (!operator) {
        return (received, filtered) => received === filtered;
    }
    const operators = { ...operatorCheckMap, ...overrides };
    return operators[operator];
}
exports.getFilteringFn = getFilteringFn;
//# sourceMappingURL=get-filtering-fn.js.map