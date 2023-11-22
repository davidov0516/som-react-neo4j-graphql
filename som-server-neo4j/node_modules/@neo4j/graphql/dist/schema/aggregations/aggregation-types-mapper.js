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
exports.AggregationTypesMapper = void 0;
const id_1 = require("../resolvers/field/id");
const numerical_1 = require("../resolvers/field/numerical");
class AggregationTypesMapper {
    constructor(composer, subgraph) {
        this.subgraph = subgraph;
        this.requiredAggregationSelectionTypes = this.getOrCreateAggregationSelectionTypes({
            composer,
            nullable: false,
        });
        this.nullableAggregationSelectionTypes = this.getOrCreateAggregationSelectionTypes({
            composer,
            nullable: true,
        });
    }
    getAggregationType({ fieldName, nullable, }) {
        if (nullable) {
            return this.nullableAggregationSelectionTypes[fieldName];
        }
        return this.requiredAggregationSelectionTypes[fieldName];
    }
    getOrCreateAggregationSelectionTypes({ composer, nullable, }) {
        const composeInt = {
            type: this.makeNullable("Int", nullable),
            resolve: numerical_1.numericalResolver,
            args: {},
        };
        const composeFloat = {
            type: this.makeNullable("Float", nullable),
            resolve: numerical_1.numericalResolver,
            args: {},
        };
        const composeId = {
            type: this.makeNullable("ID", nullable),
            resolve: id_1.idResolver,
            args: {},
        };
        const directives = this.subgraph ? [this.subgraph.getFullyQualifiedDirectiveName("shareable")] : [];
        const aggregationSelectionTypeMatrix = [
            {
                name: "ID",
                fields: {
                    shortest: composeId,
                    longest: composeId,
                },
                directives,
            },
            {
                name: "String",
                fields: {
                    shortest: this.makeNullable("String", nullable),
                    longest: this.makeNullable("String", nullable),
                },
                directives,
            },
            {
                name: "Float",
                fields: {
                    max: composeFloat,
                    min: composeFloat,
                    average: composeFloat,
                    sum: composeFloat,
                },
                directives,
            },
            {
                name: "Int",
                fields: {
                    max: composeInt,
                    min: composeInt,
                    average: composeFloat,
                    sum: composeInt,
                },
                directives,
            },
            {
                name: "BigInt",
                fields: {
                    max: this.makeNullable("BigInt", nullable),
                    min: this.makeNullable("BigInt", nullable),
                    average: this.makeNullable("BigInt", nullable),
                    sum: this.makeNullable("BigInt", nullable),
                },
                directives,
            },
            { name: "DateTime" },
            { name: "LocalDateTime" },
            { name: "LocalTime" },
            { name: "Time" },
            { name: "Duration" },
        ];
        const aggregationSelectionTypes = aggregationSelectionTypeMatrix.reduce((res, { name, fields, directives }) => {
            const type = this.createType({ composer, nullable, name, fields, directives });
            res[name] = type;
            return res;
        }, {});
        return aggregationSelectionTypes;
    }
    createType({ composer, nullable, name, fields, directives = [], }) {
        const typeName = this.makeNullable(name, nullable);
        const nullableStr = nullable ? "Nullable" : "NonNullable";
        return composer.getOrCreateOTC(`${name}AggregateSelection${nullableStr}`, (tc) => {
            tc.addFields(fields ?? { min: typeName, max: typeName });
            for (const directive of directives) {
                tc.setDirectiveByName(directive);
            }
        });
    }
    makeNullable(typeStr, isNullable) {
        return `${typeStr}${isNullable ? "" : "!"}`;
    }
}
exports.AggregationTypesMapper = AggregationTypesMapper;
//# sourceMappingURL=aggregation-types-mapper.js.map