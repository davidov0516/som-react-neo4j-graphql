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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregationDurationFilter = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const AggregationPropertyFilter_1 = require("./AggregationPropertyFilter");
class AggregationDurationFilter extends AggregationPropertyFilter_1.AggregationPropertyFilter {
    getOperation(expr) {
        if (!this.aggregationOperator) {
            return this.createDurationOperation({
                operator: this.logicalOperator,
                property: expr,
                param: new cypher_builder_1.default.Param(this.comparisonValue),
            });
        }
        return this.createBaseOperation({
            operator: this.logicalOperator,
            property: expr,
            param: new cypher_builder_1.default.Param(this.comparisonValue),
        });
    }
    createDurationOperation({ operator, property, param, }) {
        const variable = cypher_builder_1.default.plus(cypher_builder_1.default.datetime(), param);
        const propertyRef = cypher_builder_1.default.plus(cypher_builder_1.default.datetime(), property);
        return this.createBaseOperation({
            operator,
            property: propertyRef,
            param: variable,
        });
    }
}
exports.AggregationDurationFilter = AggregationDurationFilter;
//# sourceMappingURL=AggregationDurationPropertyFilter.js.map