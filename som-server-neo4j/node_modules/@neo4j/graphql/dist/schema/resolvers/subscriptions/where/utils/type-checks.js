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
exports.isInterfaceSpecificFieldType = exports.isStandardType = exports.isInterfaceType = exports.isIDAsString = exports.isStringType = exports.isFloatType = void 0;
const neo4j_driver_1 = require("neo4j-driver");
const InterfaceEntityAdapter_1 = require("../../../../../schema-model/entity/model-adapters/InterfaceEntityAdapter");
function isFloatType(fieldMeta) {
    return fieldMeta?.typeMeta.name === "Float";
}
exports.isFloatType = isFloatType;
function isStringType(fieldMeta) {
    return fieldMeta?.typeMeta.name === "String";
}
exports.isStringType = isStringType;
function isIDType(fieldMeta) {
    return fieldMeta?.typeMeta.name === "ID";
}
function isIDAsString(fieldMeta, value) {
    return isIDType(fieldMeta) && (0, neo4j_driver_1.int)(value).toString() !== value;
}
exports.isIDAsString = isIDAsString;
function isInterfaceType(node, receivedEventRelationship) {
    return !!(receivedEventRelationship.target instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter);
}
exports.isInterfaceType = isInterfaceType;
function isStandardType(node, receivedEventRelationship) {
    return !(receivedEventRelationship.target instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter);
}
exports.isStandardType = isStandardType;
function isInterfaceSpecificFieldType(node) {
    return !!node;
}
exports.isInterfaceSpecificFieldType = isInterfaceSpecificFieldType;
//# sourceMappingURL=type-checks.js.map