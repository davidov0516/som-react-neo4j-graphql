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
exports.PointFilter = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const PropertyFilter_1 = require("./PropertyFilter");
class PointFilter extends PropertyFilter_1.PropertyFilter {
    getOperation(prop) {
        return this.createPointOperation({
            operator: this.operator || "EQ",
            property: prop,
            param: new cypher_builder_1.default.Param(this.comparisonValue),
            attribute: this.attribute,
        });
    }
    createPointOperation({ operator, property, param, attribute, }) {
        const pointDistance = this.createPointDistanceExpression(property, param);
        const distanceRef = param.property("distance");
        switch (operator) {
            case "LT":
                return cypher_builder_1.default.lt(pointDistance, distanceRef);
            case "LTE":
                return cypher_builder_1.default.lte(pointDistance, distanceRef);
            case "GT":
                return cypher_builder_1.default.gt(pointDistance, distanceRef);
            case "GTE":
                return cypher_builder_1.default.gte(pointDistance, distanceRef);
            case "DISTANCE":
                return cypher_builder_1.default.eq(pointDistance, distanceRef);
            case "EQ": {
                if (attribute.typeHelper.isList()) {
                    const pointList = this.createPointListComprehension(param);
                    return cypher_builder_1.default.eq(property, pointList);
                }
                return cypher_builder_1.default.eq(property, cypher_builder_1.default.point(param));
            }
            case "IN": {
                const pointList = this.createPointListComprehension(param);
                return cypher_builder_1.default.in(property, pointList);
            }
            case "INCLUDES":
                return cypher_builder_1.default.in(cypher_builder_1.default.point(param), property);
            default:
                throw new Error(`Invalid operator ${operator}`);
        }
    }
    createPointListComprehension(param) {
        const comprehensionVar = new cypher_builder_1.default.Variable();
        const mapPoint = cypher_builder_1.default.point(comprehensionVar);
        return new cypher_builder_1.default.ListComprehension(comprehensionVar, param).map(mapPoint);
    }
    createPointDistanceExpression(property, param) {
        const nestedPointRef = param.property("point");
        return cypher_builder_1.default.point.distance(property, cypher_builder_1.default.point(nestedPointRef));
    }
}
exports.PointFilter = PointFilter;
//# sourceMappingURL=PointFilter.js.map