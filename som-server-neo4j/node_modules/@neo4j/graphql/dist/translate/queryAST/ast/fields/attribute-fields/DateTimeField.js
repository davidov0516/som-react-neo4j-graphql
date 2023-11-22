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
exports.DateTimeField = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const AttributeField_1 = require("./AttributeField");
class DateTimeField extends AttributeField_1.AttributeField {
    getCypherExpr(target) {
        const targetProperty = target.property(this.attribute.databaseName);
        return this.createDateTimeProjection(targetProperty);
    }
    getProjectionField(variable) {
        const targetProperty = variable.property(this.attribute.databaseName);
        const fieldExpr = this.createDateTimeProjection(targetProperty);
        return { [this.alias]: fieldExpr };
    }
    createDateTimeProjection(targetProperty) {
        if (this.attribute.typeHelper.isList()) {
            return this.createArrayProjection(targetProperty);
        }
        return this.createApocConvertFormat(targetProperty);
    }
    createArrayProjection(targetProperty) {
        const comprehensionVariable = new cypher_builder_1.default.Variable();
        const apocFormat = this.createApocConvertFormat(comprehensionVariable);
        return new cypher_builder_1.default.ListComprehension(comprehensionVariable).in(targetProperty).map(apocFormat);
    }
    createApocConvertFormat(variableOrProperty) {
        return cypher_builder_1.default.apoc.date.convertFormat(variableOrProperty, "iso_zoned_date_time", "iso_offset_date_time");
    }
}
exports.DateTimeField = DateTimeField;
//# sourceMappingURL=DateTimeField.js.map