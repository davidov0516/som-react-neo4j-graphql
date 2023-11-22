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
exports.GraphQLBigInt = void 0;
const graphql_1 = require("graphql");
const neo4j_driver_1 = require("neo4j-driver");
exports.GraphQLBigInt = new graphql_1.GraphQLScalarType({
    name: "BigInt",
    description: "A BigInt value up to 64 bits in size, which can be a number or a string if used inline, or a string only if used as a variable. Always returned as a string.",
    serialize(outputValue) {
        if ((0, neo4j_driver_1.isInt)(outputValue)) {
            return outputValue.toString(10);
        }
        if (typeof outputValue === "string") {
            return outputValue;
        }
        if (typeof outputValue === "number") {
            return outputValue.toString(10);
        }
        throw new graphql_1.GraphQLError(`BigInt cannot represent value: ${outputValue}`);
    },
    parseValue(inputValue) {
        if (typeof inputValue !== "string") {
            throw new graphql_1.GraphQLError("BigInt values are not JSON serializable. Please pass as a string in variables, or inline in the GraphQL query.");
        }
        return (0, neo4j_driver_1.int)(inputValue);
    },
    parseLiteral(ast) {
        switch (ast.kind) {
            case graphql_1.Kind.INT:
            case graphql_1.Kind.STRING:
                return (0, neo4j_driver_1.int)(ast.value);
            default:
                throw new graphql_1.GraphQLError("Value must be either a BigInt, or a string representing a BigInt value.");
        }
    },
});
//# sourceMappingURL=BigInt.js.map