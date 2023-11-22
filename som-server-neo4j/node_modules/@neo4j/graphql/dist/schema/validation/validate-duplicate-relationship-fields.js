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
exports.validateDuplicateRelationshipFields = void 0;
const get_field_type_meta_1 = __importDefault(require("../get-field-type-meta"));
const graphql_1 = require("graphql");
function validateDuplicateRelationshipFields(objType) {
    if (!objType.fields) {
        return;
    }
    const relationshipUsages = new Set();
    for (const field of objType.fields) {
        if (!field.directives) {
            continue;
        }
        const relationshipDirective = field.directives.find((directive) => directive.name.value === "relationship");
        if (!relationshipDirective || !relationshipDirective.arguments) {
            continue;
        }
        const typeArg = relationshipDirective.arguments.find((arg) => arg.name.value === "type");
        const directionArg = relationshipDirective.arguments.find((arg) => arg.name.value === "direction");
        if (!typeArg || !directionArg) {
            continue;
        }
        if (typeArg.value.kind !== graphql_1.Kind.STRING) {
            throw new Error("@relationship type expects a string");
        }
        if (directionArg.value.kind !== graphql_1.Kind.ENUM) {
            throw new Error("@relationship direction expects an enum");
        }
        // TODO: remove reference to getFieldTypeMeta
        const typeMeta = (0, get_field_type_meta_1.default)(field.type);
        if (relationshipUsages.has(`${typeMeta.name}__${typeArg.value.value}__${directionArg.value.value}`)) {
            throw new Error("Multiple relationship fields with the same type and direction may not have the same relationship type.");
        }
        relationshipUsages.add(`${typeMeta.name}__${typeArg.value.value}__${directionArg.value.value}`);
    }
}
exports.validateDuplicateRelationshipFields = validateDuplicateRelationshipFields;
//# sourceMappingURL=validate-duplicate-relationship-fields.js.map