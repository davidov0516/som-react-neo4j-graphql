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
exports.GraphQLDate = void 0;
const graphql_1 = require("graphql");
const neo4j_driver_1 = __importStar(require("neo4j-driver"));
const formatDateString = (dateString) => new Date(dateString).toISOString().split("T")[0];
exports.GraphQLDate = new graphql_1.GraphQLScalarType({
    name: "Date",
    description: "A date, represented as a 'yyyy-mm-dd' string",
    serialize: (outputValue) => {
        if (typeof outputValue === "string") {
            return formatDateString(outputValue);
        }
        if ((0, neo4j_driver_1.isDate)(outputValue)) {
            return formatDateString(outputValue.toString());
        }
        throw new graphql_1.GraphQLError(`Date cannot represent value: ${outputValue}`);
    },
    parseValue: (inputValue) => {
        if (typeof inputValue === "string") {
            return neo4j_driver_1.default.types.Date.fromStandardDate(new Date(inputValue));
        }
        if ((0, neo4j_driver_1.isDate)(inputValue)) {
            return inputValue;
        }
        throw new graphql_1.GraphQLError(`Date cannot represent non string value: ${inputValue}`);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError("Date cannot represent non string value.");
        }
        return neo4j_driver_1.default.types.Date.fromStandardDate(new Date(ast.value));
    },
});
//# sourceMappingURL=Date.js.map