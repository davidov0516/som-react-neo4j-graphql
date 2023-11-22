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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLLocalTime = exports.parseLocalTime = exports.LOCAL_TIME_REGEX = void 0;
const graphql_1 = require("graphql");
const neo4j_driver_1 = __importStar(require("neo4j-driver"));
exports.LOCAL_TIME_REGEX = /^(?<hour>[01]\d|2[0-3]):(?<minute>[0-5]\d):(?<second>[0-5]\d)(\.(?<fraction>\d{1}(?:\d{0,8})))?$/;
const parseLocalTime = (value) => {
    if (typeof value !== "string") {
        throw new TypeError(`Value must be of type string: ${value}`);
    }
    const match = exports.LOCAL_TIME_REGEX.exec(value);
    if (!match) {
        throw new TypeError(`Value must be formatted as LocalTime: ${value}`);
    }
    const { hour, minute, second, fraction } = match.groups;
    // Calculate the number of nanoseconds by padding the fraction of seconds with zeroes to nine digits
    let nanosecond = 0;
    if (fraction) {
        nanosecond = +`${fraction}000000000`.substring(0, 9);
    }
    return {
        hour: +hour,
        minute: +minute,
        second: +second,
        nanosecond,
    };
};
exports.parseLocalTime = parseLocalTime;
const parse = (value) => {
    if ((0, neo4j_driver_1.isLocalTime)(value)) {
        return value;
    }
    const { hour, minute, second, nanosecond } = (0, exports.parseLocalTime)(value);
    return new neo4j_driver_1.default.types.LocalTime(hour, minute, second, nanosecond);
};
exports.GraphQLLocalTime = new graphql_1.GraphQLScalarType({
    name: "LocalTime",
    description: "A local time, represented as a time string without timezone information",
    serialize: (value) => {
        if (typeof value !== "string" && !(value instanceof neo4j_driver_1.default.types.LocalTime)) {
            throw new TypeError(`Value must be of type string: ${value}`);
        }
        const stringifiedValue = value.toString();
        if (!exports.LOCAL_TIME_REGEX.test(stringifiedValue)) {
            throw new TypeError(`Value must be formatted as LocalTime: ${stringifiedValue}`);
        }
        return stringifiedValue;
    },
    parseValue: (value) => {
        return parse(value);
    },
    parseLiteral: (ast) => {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Only strings can be validated as LocalTime, but received: ${ast.kind}`);
        }
        return parse(ast.value);
    },
});
//# sourceMappingURL=LocalTime.js.map