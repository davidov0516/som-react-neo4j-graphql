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
exports.createAggregationInputFields = void 0;
const constants_1 = require("../../constants");
const ConcreteEntityAdapter_1 = require("../../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const constants_2 = require("../constants");
function createAggregationInputFields(entity, rel, schemaComposer) {
    const aggregationFields = entity.aggregationWhereFields;
    if (!aggregationFields.length) {
        return;
    }
    const aggregationInputName = rel.operations.getAggregationWhereInputTypeName(entity instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter ? `Node` : `Edge`);
    const aggregationInput = schemaComposer.createInputTC({
        name: aggregationInputName,
        fields: {
            AND: `[${aggregationInputName}!]`,
            OR: `[${aggregationInputName}!]`,
            NOT: aggregationInputName,
        },
    });
    for (const aggregationField of aggregationFields) {
        switch (aggregationField.getTypeName()) {
            case "ID":
                createIDAggregationInputFields(aggregationInput, aggregationField);
                break;
            case "String":
                createStringAggregationInputFields(aggregationInput, aggregationField);
                break;
            // Types that you can average
            // https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-avg
            // https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-avg-duration
            // String uses avg(size())
            case "Int":
            case "Float":
            case "BigInt":
            case "Duration":
                createAverageAggregationInputFields(aggregationInput, aggregationField);
                break;
            default:
                createComparisonAggregationInputFields(aggregationInput, aggregationField);
                break;
        }
    }
    return aggregationInput;
}
exports.createAggregationInputFields = createAggregationInputFields;
function createComparisonAggregationInputFields(aggregationInput, field) {
    aggregationInput.addFields(constants_1.AGGREGATION_COMPARISON_OPERATORS.reduce((res, operator) => ({
        ...res,
        [`${field.name}_${operator}`]: {
            type: field.getTypeName(),
            directives: [constants_2.DEPRECATE_INVALID_AGGREGATION_FILTERS],
        },
        [`${field.name}_MIN_${operator}`]: field.getTypeName(),
        [`${field.name}_MAX_${operator}`]: field.getTypeName(),
    }), {}));
}
function createAverageAggregationInputFields(aggregationInput, field) {
    aggregationInput.addFields(constants_1.AGGREGATION_COMPARISON_OPERATORS.reduce((res, operator) => {
        let averageType = "Float";
        if (field.getTypeName() === "BigInt") {
            averageType = "BigInt";
        }
        if (field.getTypeName() === "Duration") {
            averageType = "Duration";
        }
        return {
            ...res,
            [`${field.name}_${operator}`]: {
                type: field.getTypeName(),
                directives: [constants_2.DEPRECATE_INVALID_AGGREGATION_FILTERS],
            },
            [`${field.name}_AVERAGE_${operator}`]: averageType,
            [`${field.name}_MIN_${operator}`]: field.getTypeName(),
            [`${field.name}_MAX_${operator}`]: field.getTypeName(),
            ...(field.getTypeName() !== "Duration"
                ? { [`${field.name}_SUM_${operator}`]: field.getTypeName() }
                : {}),
        };
    }, {}));
    return;
}
function createStringAggregationInputFields(aggregationInput, field) {
    aggregationInput.addFields(constants_1.AGGREGATION_COMPARISON_OPERATORS.reduce((res, operator) => {
        return {
            ...res,
            [`${field.name}_${operator}`]: {
                type: `${operator === "EQUAL" ? "String" : "Int"}`,
                directives: [constants_2.DEPRECATE_INVALID_AGGREGATION_FILTERS],
            },
            [`${field.name}_AVERAGE_${operator}`]: {
                type: "Float",
                directives: [constants_2.DEPRECATE_IMPLICIT_LENGTH_AGGREGATION_FILTERS],
            },
            [`${field.name}_LONGEST_${operator}`]: {
                type: "Int",
                directives: [constants_2.DEPRECATE_IMPLICIT_LENGTH_AGGREGATION_FILTERS],
            },
            [`${field.name}_SHORTEST_${operator}`]: {
                type: "Int",
                directives: [constants_2.DEPRECATE_IMPLICIT_LENGTH_AGGREGATION_FILTERS],
            },
            [`${field.name}_AVERAGE_LENGTH_${operator}`]: "Float",
            [`${field.name}_LONGEST_LENGTH_${operator}`]: "Int",
            [`${field.name}_SHORTEST_LENGTH_${operator}`]: "Int",
        };
    }, {}));
    return;
}
function createIDAggregationInputFields(aggregationInput, field) {
    aggregationInput.addFields({
        [`${field.name}_EQUAL`]: {
            type: `ID`,
            directives: [constants_2.DEPRECATE_INVALID_AGGREGATION_FILTERS],
        },
    });
    return;
}
//# sourceMappingURL=create-aggregation-input-fields.js.map