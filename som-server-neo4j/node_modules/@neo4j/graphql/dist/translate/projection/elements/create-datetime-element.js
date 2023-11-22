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
exports.createDatetimeExpression = exports.wrapApocConvertDate = exports.createDatetimeElement = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const compile_cypher_1 = require("../../../utils/compile-cypher");
/** Deprecated in favor of createDatetimeExpression */
function createDatetimeElement({ resolveTree, field, variable, valueOverride, }) {
    const dbFieldName = field.dbPropertyName || resolveTree.name;
    return new cypher_builder_1.default.RawCypher((env) => field.typeMeta.array
        ? `${resolveTree.alias}: [ dt in ${(0, compile_cypher_1.compileCypher)(variable, env)}.${dbFieldName} | ${wrapApocConvertDate("dt")} ]`
        : `${resolveTree.alias}: ${wrapApocConvertDate(valueOverride || `${(0, compile_cypher_1.compileCypher)(variable, env)}.${dbFieldName}`)}`);
}
exports.createDatetimeElement = createDatetimeElement;
function wrapApocConvertDate(value) {
    return `apoc.date.convertFormat(toString(${value}), "iso_zoned_date_time", "iso_offset_date_time")`;
}
exports.wrapApocConvertDate = wrapApocConvertDate;
function createDatetimeExpression({ resolveTree, field, variable, }) {
    const dbFieldName = field.dbPropertyName || resolveTree.name;
    const fieldProperty = variable.property(dbFieldName);
    if (field.typeMeta.array) {
        const comprehensionVariable = new cypher_builder_1.default.Variable();
        const apocFormat = createApocConvertFormat(comprehensionVariable);
        return new cypher_builder_1.default.ListComprehension(comprehensionVariable).in(fieldProperty).map(apocFormat);
    }
    return createApocConvertFormat(fieldProperty);
}
exports.createDatetimeExpression = createDatetimeExpression;
function createApocConvertFormat(variableOrProperty) {
    return cypher_builder_1.default.apoc.date.convertFormat(variableOrProperty, "iso_zoned_date_time", "iso_offset_date_time");
}
//# sourceMappingURL=create-datetime-element.js.map