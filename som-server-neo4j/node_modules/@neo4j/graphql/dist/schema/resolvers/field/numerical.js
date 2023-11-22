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
exports.numericalResolver = void 0;
const neo4j_driver_1 = require("neo4j-driver");
const defaultField_1 = require("./defaultField");
function isIntegerable(value) {
    if (!value) {
        return false;
    }
    if (["number", "string", "bigint"].includes(typeof value)) {
        return true;
    }
    if ((0, neo4j_driver_1.isInt)(value)) {
        return true;
    }
    if (typeof value === "object") {
        // FIXME: necessary for neo-push tests to pass
        const castedValue = value;
        if (Object.keys(castedValue).length === 2 &&
            Object.prototype.hasOwnProperty.call(castedValue, "low") &&
            Object.prototype.hasOwnProperty.call(castedValue, "high")) {
            return true;
        }
    }
    return false;
}
function serializeValue(value) {
    if (isIntegerable(value)) {
        return neo4j_driver_1.integer.toNumber(value);
    }
    return value;
}
function numericalResolver(source, args, context, info) {
    const value = (0, defaultField_1.defaultFieldResolver)(source, args, context, info);
    if (Array.isArray(value)) {
        return value.map((v) => {
            return serializeValue(v);
        });
    }
    return serializeValue(value);
}
exports.numericalResolver = numericalResolver;
//# sourceMappingURL=numerical.js.map