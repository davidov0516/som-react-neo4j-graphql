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
exports.generateMissingOrAliasedFields = exports.generateResolveTree = exports.filterFieldsInSelection = exports.getAliasedResolveTreeByFieldName = exports.getResolveTreeByFieldName = void 0;
const utils_1 = require("../../utils/utils");
/** Finds a resolve tree of selection based on field name */
function getResolveTreeByFieldName({ fieldName, selection, }) {
    return Object.values(selection).find((resolveTree) => resolveTree.name === fieldName);
}
exports.getResolveTreeByFieldName = getResolveTreeByFieldName;
/** Finds an aliased resolve tree of selection based on field name */
function getAliasedResolveTreeByFieldName({ fieldName, selection, }) {
    return Object.values(selection).find((resolveTree) => resolveTree.name === fieldName && resolveTree.alias !== fieldName);
}
exports.getAliasedResolveTreeByFieldName = getAliasedResolveTreeByFieldName;
function filterFieldsInSelection({ fields, selection, }) {
    return fields.filter((field) => Object.values(selection).find((f) => f.name === field.fieldName));
}
exports.filterFieldsInSelection = filterFieldsInSelection;
/** Generates a field to be used in creating projections */
function generateResolveTree({ name, alias, args = {}, fieldsByTypeName = {}, }) {
    return {
        [name]: {
            name,
            alias: alias ?? name,
            args,
            fieldsByTypeName,
        },
    };
}
exports.generateResolveTree = generateResolveTree;
/** Generates missing fields based on an array of fieldNames */
function generateMissingOrAliasedFields({ fieldNames, selection, }) {
    return (0, utils_1.removeDuplicates)(fieldNames).reduce((acc, fieldName) => {
        const exists = getResolveTreeByFieldName({ fieldName, selection });
        const aliased = getAliasedResolveTreeByFieldName({ fieldName, selection });
        if (!exists || aliased) {
            return { ...acc, ...generateResolveTree({ name: fieldName }) };
        }
        return acc;
    }, {});
}
exports.generateMissingOrAliasedFields = generateMissingOrAliasedFields;
//# sourceMappingURL=resolveTree.js.map