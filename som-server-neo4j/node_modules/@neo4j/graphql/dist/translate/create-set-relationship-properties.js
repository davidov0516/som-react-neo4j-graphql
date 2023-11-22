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
const map_to_db_property_1 = __importDefault(require("../utils/map-to-db-property"));
const callback_utils_1 = require("./utils/callback-utils");
const math_1 = require("./utils/math");
/*
    TODO - lets reuse this function for setting either node or rel properties.
           This was not reused due to the large differences between node fields
           - and relationship fields.
*/
function createSetRelationshipProperties({ properties, varName, withVars, relationship, operation, callbackBucket, parameterPrefix, }) {
    const strs = [];
    relationship.primitiveFields.forEach((primitiveField) => {
        if (primitiveField?.autogenerate) {
            if (operation === "CREATE") {
                strs.push(`SET ${varName}.${primitiveField.dbPropertyName} = randomUUID()`);
            }
        }
    });
    relationship.temporalFields.forEach((temporalField) => {
        if (["DateTime", "Time"].includes(temporalField.typeMeta.name) &&
            temporalField?.timestamps?.includes(operation)) {
            // DateTime -> datetime(); Time -> time()
            strs.push(`SET ${varName}.${temporalField.dbPropertyName} = ${temporalField.typeMeta.name.toLowerCase()}()`);
        }
    });
    relationship.primitiveFields.forEach((field) => (0, callback_utils_1.addCallbackAndSetParam)(field, varName, properties, callbackBucket, strs, operation));
    Object.entries(properties).forEach(([key, value], _idx, propertiesEntries) => {
        const paramName = `${parameterPrefix}.${key}`;
        const pointField = relationship.pointFields.find((x) => x.fieldName === key);
        if (pointField) {
            if (pointField.typeMeta.array) {
                strs.push(`SET ${varName}.${pointField.dbPropertyName} = [p in $${paramName} | point(p)]`);
            }
            else {
                strs.push(`SET ${varName}.${pointField.dbPropertyName} = point($${paramName})`);
            }
            return;
        }
        const arrayPushField = relationship.primitiveFields.find((x) => `${x.fieldName}_PUSH` === key);
        if (arrayPushField && arrayPushField.dbPropertyName) {
            assertNonAmbiguousUpdate(propertiesEntries, arrayPushField.dbPropertyName);
            strs.push(`SET ${varName}.${arrayPushField.dbPropertyName} = ${varName}.${arrayPushField.dbPropertyName} + $${paramName}`);
            return;
        }
        const pointArrayPushField = relationship.pointFields.find((x) => `${x.fieldName}_PUSH` === key);
        if (pointArrayPushField && pointArrayPushField.dbPropertyName) {
            assertNonAmbiguousUpdate(propertiesEntries, pointArrayPushField.dbPropertyName);
            strs.push(`SET ${varName}.${pointArrayPushField.dbPropertyName} = ${varName}.${pointArrayPushField.dbPropertyName} + [p in $${paramName} | point(p)]`);
            return;
        }
        const arrayPopField = relationship.primitiveFields.find((x) => `${x.fieldName}_POP` === key);
        if (arrayPopField && arrayPopField.dbPropertyName) {
            assertNonAmbiguousUpdate(propertiesEntries, arrayPopField.dbPropertyName);
            strs.push(`SET ${varName}.${arrayPopField.dbPropertyName} = ${varName}.${arrayPopField.dbPropertyName}[0..-$${paramName}]`);
            return;
        }
        const pointArrayPopField = relationship.pointFields.find((x) => `${x.fieldName}_POP` === key);
        if (pointArrayPopField && pointArrayPopField.dbPropertyName) {
            assertNonAmbiguousUpdate(propertiesEntries, pointArrayPopField.dbPropertyName);
            strs.push(`SET ${varName}.${pointArrayPopField.dbPropertyName} = ${varName}.${pointArrayPopField.dbPropertyName}[0..-$${paramName}]`);
            return;
        }
        const mathMatch = (0, math_1.matchMathField)(key);
        const { hasMatched } = mathMatch;
        if (hasMatched) {
            const mathDescriptor = (0, math_1.mathDescriptorBuilder)(value, relationship, mathMatch);
            assertNonAmbiguousUpdate(propertiesEntries, mathDescriptor.dbName);
            const mathStatements = (0, math_1.buildMathStatements)(mathDescriptor, varName, withVars, paramName);
            strs.push(...mathStatements);
            return;
        }
        const dbFieldName = (0, map_to_db_property_1.default)(relationship, key);
        strs.push(`SET ${varName}.${dbFieldName} = $${paramName}`);
    });
    return strs.join("\n");
    function assertNonAmbiguousUpdate(propertiesEntries, propertyName) {
        if (propertiesEntries.find(([entryKey]) => entryKey === propertyName)) {
            throw new Error(`Cannot mutate the same field multiple times in one Mutation: ${propertyName}`);
        }
    }
}
exports.default = createSetRelationshipProperties;
//# sourceMappingURL=create-set-relationship-properties.js.map