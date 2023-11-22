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
exports.withFullTextResultType = exports.withFullTextSortInputType = exports.withFullTextWhereInputType = exports.withFullTextInputType = void 0;
const graphql_1 = require("graphql");
const fulltext_1 = require("../../graphql/directives/fulltext");
const FloatWhere_1 = require("../../graphql/input-objects/FloatWhere");
const SortDirection_1 = require("../../graphql/enums/SortDirection");
function withFullTextInputType({ concreteEntityAdapter, composer, }) {
    const typeName = concreteEntityAdapter.operations.fullTextInputTypeName;
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const fields = makeFullTextInputFields({ concreteEntityAdapter, composer });
    const fulltextInputType = composer.createInputTC({
        name: typeName,
        fields,
    });
    return fulltextInputType;
}
exports.withFullTextInputType = withFullTextInputType;
function makeFullTextInputFields({ concreteEntityAdapter, composer, }) {
    const fields = {};
    if (!concreteEntityAdapter.annotations.fulltext) {
        throw new Error("Expected fulltext annotation");
    }
    for (const index of concreteEntityAdapter.annotations.fulltext.indexes) {
        const indexName = index.indexName || index.name;
        if (indexName === undefined) {
            throw new Error("The name of the fulltext index should be defined using the indexName argument.");
        }
        const fieldInput = withFullTextIndexInputType({
            concreteEntityAdapter,
            indexName,
            composer,
        });
        if (fieldInput) {
            fields[indexName] = fieldInput;
        }
    }
    return fields;
}
function withFullTextIndexInputType({ composer, concreteEntityAdapter, indexName, }) {
    const typeName = concreteEntityAdapter.operations.getFullTextIndexInputTypeName(indexName);
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const indexInput = composer.createInputTC({
        name: typeName,
        fields: {
            phrase: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
        },
    });
    return indexInput;
}
function withFullTextWhereInputType({ composer, concreteEntityAdapter, }) {
    const typeName = concreteEntityAdapter.operations.fulltextTypeNames.where;
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const whereInput = composer.createInputTC({
        name: typeName,
        description: `The input for filtering a fulltext query on an index of ${concreteEntityAdapter.name}`,
        fields: {
            [fulltext_1.SCORE_FIELD]: FloatWhere_1.FloatWhere.name,
            [concreteEntityAdapter.singular]: concreteEntityAdapter.operations.whereInputTypeName,
        },
    });
    return whereInput;
}
exports.withFullTextWhereInputType = withFullTextWhereInputType;
function withFullTextSortInputType({ composer, concreteEntityAdapter, }) {
    const typeName = concreteEntityAdapter.operations.fulltextTypeNames.sort;
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const whereInput = composer.createInputTC({
        name: typeName,
        description: `The input for sorting a fulltext query on an index of ${concreteEntityAdapter.name}`,
        fields: {
            [fulltext_1.SCORE_FIELD]: SortDirection_1.SortDirection.name,
            [concreteEntityAdapter.singular]: concreteEntityAdapter.operations.sortInputTypeName,
        },
    });
    return whereInput;
}
exports.withFullTextSortInputType = withFullTextSortInputType;
function withFullTextResultType({ composer, concreteEntityAdapter, }) {
    const typeName = concreteEntityAdapter.operations.fulltextTypeNames.result;
    if (composer.has(typeName)) {
        return composer.getOTC(typeName);
    }
    const whereInput = composer.createObjectTC({
        name: typeName,
        description: `The result of a fulltext search on an index of ${concreteEntityAdapter.name}`,
        fields: {
            [fulltext_1.SCORE_FIELD]: new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat),
            [concreteEntityAdapter.singular]: `${concreteEntityAdapter.name}!`,
        },
    });
    return whereInput;
}
exports.withFullTextResultType = withFullTextResultType;
//# sourceMappingURL=fulltext-input.js.map