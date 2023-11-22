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
exports.getFieldByName = exports.getReferenceRelation = exports.getReferenceNode = exports.getFieldType = exports.AggregationType = void 0;
var AggregationType;
(function (AggregationType) {
    AggregationType["Int"] = "IntAggregateSelection";
    AggregationType["String"] = "StringAggregateSelection";
    AggregationType["BigInt"] = "BigIntAggregateSelection";
    AggregationType["Float"] = "FloatAggregateSelection";
    AggregationType["Id"] = "IDAggregateSelection";
    AggregationType["DateTime"] = "DateTimeAggregateSelection";
})(AggregationType || (exports.AggregationType = AggregationType = {}));
function getFieldType(field) {
    for (const candidateField of Object.values(AggregationType)) {
        if (field.fieldsByTypeName[`${candidateField}NonNullable`] ||
            field.fieldsByTypeName[`${candidateField}Nullable`])
            return candidateField;
    }
    return undefined;
}
exports.getFieldType = getFieldType;
function getReferenceNode(context, relationField) {
    return context.nodes.find((x) => x.name === relationField.typeMeta.name);
}
exports.getReferenceNode = getReferenceNode;
function getReferenceRelation(context, connectionField) {
    return context.relationships.find((x) => x.name === connectionField.relationshipTypeName);
}
exports.getReferenceRelation = getReferenceRelation;
function getFieldByName(name, fields) {
    return Object.values(fields).find((tree) => tree.name === name);
}
exports.getFieldByName = getFieldByName;
//# sourceMappingURL=utils.js.map