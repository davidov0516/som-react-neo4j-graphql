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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRelationshipPropertyValue = exports.createRelationshipPropertyElement = void 0;
const map_to_db_property_1 = __importDefault(require("../../../utils/map-to-db-property"));
const create_datetime_element_1 = require("./create-datetime-element");
const create_point_element_1 = __importStar(require("./create-point-element"));
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
function createRelationshipPropertyElement({ resolveTree, relationship, relationshipVariable, }) {
    const temporalField = relationship.temporalFields.find((f) => f.fieldName === resolveTree.name);
    const pointField = relationship.pointFields.find((f) => f.fieldName === resolveTree.name);
    if (temporalField?.typeMeta.name === "DateTime") {
        return (0, create_datetime_element_1.createDatetimeElement)({
            resolveTree,
            field: temporalField,
            variable: new cypher_builder_1.default.NamedVariable(relationshipVariable),
        });
    }
    if (pointField) {
        return (0, create_point_element_1.default)({
            resolveTree,
            field: pointField,
            variable: new cypher_builder_1.default.NamedVariable(relationshipVariable),
        });
    }
    const dbFieldName = (0, map_to_db_property_1.default)(relationship, resolveTree.name);
    return new cypher_builder_1.default.RawCypher(`${resolveTree.alias}: ${relationshipVariable}.${dbFieldName}`);
}
exports.createRelationshipPropertyElement = createRelationshipPropertyElement;
// TODO: this should generate the value that is used in createRelationshipPropertyElement
function createRelationshipPropertyValue({ resolveTree, relationship, relationshipVariable, }) {
    const temporalField = relationship.temporalFields.find((f) => f.fieldName === resolveTree.name);
    const pointField = relationship.pointFields.find((f) => f.fieldName === resolveTree.name);
    if (temporalField?.typeMeta.name === "DateTime") {
        return (0, create_datetime_element_1.createDatetimeExpression)({ resolveTree, field: temporalField, variable: relationshipVariable });
    }
    if (pointField) {
        return (0, create_point_element_1.createPointExpression)({ resolveTree, field: pointField, variable: relationshipVariable });
    }
    const dbFieldName = (0, map_to_db_property_1.default)(relationship, resolveTree.name);
    return relationshipVariable.property(dbFieldName);
}
exports.createRelationshipPropertyValue = createRelationshipPropertyValue;
//# sourceMappingURL=create-relationship-property-element.js.map