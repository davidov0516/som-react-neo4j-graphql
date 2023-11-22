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
exports.addSortAndLimitOptionsToClause = exports.addLimitOrOffsetOptionsToClause = void 0;
const neo4j = __importStar(require("neo4j-driver"));
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const fulltext_1 = require("../../../graphql/directives/fulltext");
function addLimitOrOffsetOptionsToClause({ optionsInput, projectionClause, }) {
    if (optionsInput.limit) {
        projectionClause.limit(new cypher_builder_1.default.Param(neo4j.int(optionsInput.limit)));
    }
    if (optionsInput.offset) {
        projectionClause.skip(new cypher_builder_1.default.Param(neo4j.int(optionsInput.offset)));
    }
}
exports.addLimitOrOffsetOptionsToClause = addLimitOrOffsetOptionsToClause;
function addSortAndLimitOptionsToClause({ optionsInput, target, projectionClause, nodeField, fulltextScoreVariable, cypherFields, cypherFieldAliasMap, graphElement, }) {
    if (optionsInput.sort) {
        const orderByParams = createOrderByParams({
            sortInput: optionsInput.sort || [],
            target,
            nodeField,
            fulltextScoreVariable,
            cypherFields,
            cypherFieldAliasMap,
            graphElement,
        });
        if (orderByParams.length > 0) {
            projectionClause.orderBy(...orderByParams);
        }
    }
    addLimitOrOffsetOptionsToClause({
        optionsInput,
        projectionClause,
    });
}
exports.addSortAndLimitOptionsToClause = addSortAndLimitOptionsToClause;
function createOrderByParams({ sortInput, target, nodeField, fulltextScoreVariable, cypherFields, cypherFieldAliasMap, graphElement, }) {
    const orderList = sortInput.flatMap((arg) => {
        if (fulltextScoreVariable && nodeField && arg[nodeField] && typeof arg[nodeField] === "object") {
            return Object.entries(arg[nodeField]);
        }
        return Object.entries(arg);
    });
    return orderList.map(([field, order]) => {
        const dbFieldName = graphElement ? graphElement.getField(field)?.dbPropertyName || field : field;
        // TODO: remove this once translation of cypher fields moved to cypher builder.
        if (cypherFieldAliasMap && cypherFields && cypherFields.some((f) => f.fieldName === field)) {
            return [cypherFieldAliasMap[dbFieldName], order];
        }
        if (fulltextScoreVariable && field === fulltext_1.SCORE_FIELD) {
            return [fulltextScoreVariable, order];
        }
        return [target.property(dbFieldName), order];
    });
}
//# sourceMappingURL=add-sort-and-limit-to-clause.js.map