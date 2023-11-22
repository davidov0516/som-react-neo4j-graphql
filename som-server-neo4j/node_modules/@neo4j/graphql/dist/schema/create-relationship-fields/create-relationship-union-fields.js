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
exports.createRelationshipUnionFields = void 0;
const augment_object_or_interface_1 = require("../generation/augment-object-or-interface");
const connect_input_1 = require("../generation/connect-input");
const connect_or_create_input_1 = require("../generation/connect-or-create-input");
const create_input_1 = require("../generation/create-input");
const delete_input_1 = require("../generation/delete-input");
const disconnect_input_1 = require("../generation/disconnect-input");
const relation_input_1 = require("../generation/relation-input");
const update_input_1 = require("../generation/update-input");
function createRelationshipUnionFields({ relationship, composeNode, schemaComposer, userDefinedFieldDirectives, }) {
    // ======== only on relationships to concrete | unions:
    (0, connect_or_create_input_1.withConnectOrCreateInputType)({
        relationshipAdapter: relationship,
        composer: schemaComposer,
        userDefinedFieldDirectives,
        deprecatedDirectives: [],
    });
    // ======== all relationships:
    composeNode.addFields((0, augment_object_or_interface_1.augmentObjectOrInterfaceTypeWithRelationshipField)(relationship, userDefinedFieldDirectives));
    (0, relation_input_1.withRelationInputType)({
        relationshipAdapter: relationship,
        composer: schemaComposer,
        deprecatedDirectives: [],
        userDefinedFieldDirectives,
    });
    (0, create_input_1.augmentCreateInputTypeWithRelationshipsInput)({
        relationshipAdapter: relationship,
        composer: schemaComposer,
        deprecatedDirectives: [],
        userDefinedFieldDirectives,
    });
    (0, update_input_1.augmentUpdateInputTypeWithUpdateFieldInput)({
        relationshipAdapter: relationship,
        composer: schemaComposer,
        deprecatedDirectives: [],
        userDefinedFieldDirectives,
    });
    (0, connect_input_1.augmentConnectInputTypeWithConnectFieldInput)({
        relationshipAdapter: relationship,
        composer: schemaComposer,
        deprecatedDirectives: [],
    });
    (0, delete_input_1.augmentDeleteInputTypeWithDeleteFieldInput)({
        relationshipAdapter: relationship,
        composer: schemaComposer,
        deprecatedDirectives: [],
    });
    (0, disconnect_input_1.augmentDisconnectInputTypeWithDisconnectFieldInput)({
        relationshipAdapter: relationship,
        composer: schemaComposer,
        deprecatedDirectives: [],
    });
}
exports.createRelationshipUnionFields = createRelationshipUnionFields;
//# sourceMappingURL=create-relationship-union-fields.js.map