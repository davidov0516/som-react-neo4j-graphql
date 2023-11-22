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
exports.createOnCreateITC = exports.createConnectOrCreateField = void 0;
const ensure_non_empty_input_1 = require("../ensure-non-empty-input");
const create_input_1 = require("../generation/create-input");
const to_compose_1 = require("../to-compose");
function createConnectOrCreateField({ relationshipAdapter, targetEntityAdapter, // TODO: take this from relationshipAdapter.target in the end, currently here bc unions call this function for reach refNode
schemaComposer, userDefinedFieldDirectives, }) {
    const hasUniqueFields = targetEntityAdapter.uniqueFields.length > 0;
    if (hasUniqueFields !== true) {
        return undefined;
    }
    const connectOrCreateName = relationshipAdapter.operations.getConnectOrCreateFieldInputTypeName(targetEntityAdapter);
    createOnCreateITC({
        schemaComposer,
        relationshipAdapter,
        targetEntityAdapter,
        userDefinedFieldDirectives,
    });
    schemaComposer.getOrCreateITC(targetEntityAdapter.operations.connectOrCreateWhereInputTypeName, (tc) => {
        tc.addFields(targetEntityAdapter.operations.connectOrCreateWhereInputFieldNames);
    });
    schemaComposer.getOrCreateITC(connectOrCreateName, (tc) => {
        tc.addFields(relationshipAdapter.operations.getConnectOrCreateInputFields(targetEntityAdapter) || {});
    });
    return relationshipAdapter.isList ? `[${connectOrCreateName}!]` : connectOrCreateName;
}
exports.createConnectOrCreateField = createConnectOrCreateField;
function createOnCreateITC({ schemaComposer, relationshipAdapter, targetEntityAdapter, userDefinedFieldDirectives, }) {
    const onCreateInput = schemaComposer.getOrCreateITC(targetEntityAdapter.operations.onCreateInputTypeName, (tc) => {
        const nodeFields = (0, to_compose_1.concreteEntityToCreateInputFields)(targetEntityAdapter.onCreateInputFields, userDefinedFieldDirectives);
        tc.addFields(nodeFields);
        (0, ensure_non_empty_input_1.ensureNonEmptyInput)(schemaComposer, tc);
    });
    const onCreateName = relationshipAdapter.operations.getConnectOrCreateOnCreateFieldInputTypeName(targetEntityAdapter);
    return schemaComposer.getOrCreateITC(onCreateName, (tc) => {
        const onCreateFields = {
            node: onCreateInput.NonNull,
        };
        if (relationshipAdapter.nonGeneratedProperties.length > 0) {
            const edgeFieldType = (0, create_input_1.withCreateInputType)({
                entityAdapter: relationshipAdapter,
                userDefinedFieldDirectives,
                composer: schemaComposer,
            });
            onCreateFields["edge"] = relationshipAdapter.hasNonNullNonGeneratedProperties
                ? edgeFieldType.NonNull
                : edgeFieldType;
        }
        tc.addFields(onCreateFields);
    });
}
exports.createOnCreateITC = createOnCreateITC;
//# sourceMappingURL=create-connect-or-create-field.js.map