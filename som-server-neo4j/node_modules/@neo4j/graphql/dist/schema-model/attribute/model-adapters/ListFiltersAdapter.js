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
exports.ListFiltersAdapter = void 0;
const pluralize_1 = __importDefault(require("pluralize"));
class ListFiltersAdapter {
    constructor(relationshipAdapter) {
        if (!relationshipAdapter.isList) {
            throw new Error("Relationship field is not a list");
        }
        this.relationshipAdapter = relationshipAdapter;
    }
    getAll() {
        return {
            type: `${this.relationshipAdapter.name}_ALL`,
            description: `Return ${(0, pluralize_1.default)(this.relationshipAdapter.source.name)} where all of the related ${(0, pluralize_1.default)(this.relationshipAdapter.target.name)} match this filter`,
        };
    }
    getNone() {
        return {
            type: `${this.relationshipAdapter.name}_NONE`,
            description: `Return ${(0, pluralize_1.default)(this.relationshipAdapter.source.name)} where none of the related ${(0, pluralize_1.default)(this.relationshipAdapter.target.name)} match this filter`,
        };
    }
    getSingle() {
        return {
            type: `${this.relationshipAdapter.name}_SINGLE`,
            description: `Return ${(0, pluralize_1.default)(this.relationshipAdapter.source.name)} where one of the related ${(0, pluralize_1.default)(this.relationshipAdapter.target.name)} match this filter`,
        };
    }
    getSome() {
        return {
            type: `${this.relationshipAdapter.name}_SOME`,
            description: `Return ${(0, pluralize_1.default)(this.relationshipAdapter.source.name)} where some of the related ${(0, pluralize_1.default)(this.relationshipAdapter.target.name)} match this filter`,
        };
    }
    get filters() {
        return [this.getAll(), this.getNone(), this.getSingle(), this.getSome()];
    }
    getConnectionAll() {
        return {
            type: `${this.relationshipAdapter.operations.connectionFieldName}_ALL`,
            description: `Return ${(0, pluralize_1.default)(this.relationshipAdapter.source.name)} where all of the related ${(0, pluralize_1.default)(this.relationshipAdapter.operations.connectionFieldTypename)} match this filter`,
        };
    }
    getConnectionNone() {
        return {
            type: `${this.relationshipAdapter.operations.connectionFieldName}_NONE`,
            description: `Return ${(0, pluralize_1.default)(this.relationshipAdapter.source.name)} where none of the related ${(0, pluralize_1.default)(this.relationshipAdapter.operations.connectionFieldTypename)} match this filter`,
        };
    }
    getConnectionSingle() {
        return {
            type: `${this.relationshipAdapter.operations.connectionFieldName}_SINGLE`,
            description: `Return ${(0, pluralize_1.default)(this.relationshipAdapter.source.name)} where one of the related ${(0, pluralize_1.default)(this.relationshipAdapter.operations.connectionFieldTypename)} match this filter`,
        };
    }
    getConnectionSome() {
        return {
            type: `${this.relationshipAdapter.operations.connectionFieldName}_SOME`,
            description: `Return ${(0, pluralize_1.default)(this.relationshipAdapter.source.name)} where some of the related ${(0, pluralize_1.default)(this.relationshipAdapter.operations.connectionFieldTypename)} match this filter`,
        };
    }
    get connectionFilters() {
        return [
            this.getConnectionAll(),
            this.getConnectionNone(),
            this.getConnectionSingle(),
            this.getConnectionSome(),
        ];
    }
}
exports.ListFiltersAdapter = ListFiltersAdapter;
//# sourceMappingURL=ListFiltersAdapter.js.map