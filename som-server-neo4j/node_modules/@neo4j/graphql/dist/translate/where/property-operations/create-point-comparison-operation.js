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
exports.createPointComparisonOperation = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
/** Translates a point comparison operation */
function createPointComparisonOperation({ operator, propertyRefOrCoalesce, param, pointField, }) {
    const pointDistance = createPointDistanceExpression(propertyRefOrCoalesce, param);
    const distanceRef = param.property("distance");
    switch (operator || "EQ") {
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
        case "NOT":
        case "EQ": {
            if (pointField?.typeMeta.array) {
                const pointList = createPointListComprehension(param);
                return cypher_builder_1.default.eq(propertyRefOrCoalesce, pointList);
            }
            return cypher_builder_1.default.eq(propertyRefOrCoalesce, cypher_builder_1.default.point(param));
        }
        case "IN":
        case "NOT_IN": {
            const pointList = createPointListComprehension(param);
            return cypher_builder_1.default.in(propertyRefOrCoalesce, pointList);
        }
        case "INCLUDES":
        case "NOT_INCLUDES":
            return cypher_builder_1.default.in(cypher_builder_1.default.point(param), propertyRefOrCoalesce);
        default:
            throw new Error(`Invalid operator ${operator}`);
    }
}
exports.createPointComparisonOperation = createPointComparisonOperation;
function createPointListComprehension(param) {
    const comprehensionVar = new cypher_builder_1.default.Variable();
    const mapPoint = cypher_builder_1.default.point(comprehensionVar);
    return new cypher_builder_1.default.ListComprehension(comprehensionVar, param).map(mapPoint);
}
function createPointDistanceExpression(property, param) {
    const nestedPointRef = param.property("point");
    return cypher_builder_1.default.pointDistance(property, cypher_builder_1.default.point(nestedPointRef));
}
//# sourceMappingURL=create-point-comparison-operation.js.map