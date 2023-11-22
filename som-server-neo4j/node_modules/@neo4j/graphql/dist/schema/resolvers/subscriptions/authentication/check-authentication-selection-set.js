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
exports.checkAuthenticationOnSelectionSet = void 0;
const graphql_parse_resolve_info_1 = require("graphql-parse-resolve-info");
const check_authentication_1 = require("./check-authentication");
const selection_set_parser_1 = require("./selection-set-parser");
function checkAuthenticationOnSelectionSet(resolveInfo, entityAdapter, type, context) {
    const resolveTree = (0, graphql_parse_resolve_info_1.parseResolveInfo)(resolveInfo);
    if (!resolveTree) {
        return;
    }
    const authenticatedSelections = (0, selection_set_parser_1.parseSelectionSetForAuthenticated)({
        resolveTree,
        entity: entityAdapter,
        entityTypeName: entityAdapter.operations.subscriptionEventTypeNames[type],
        entityPayloadTypeName: entityAdapter.operations.subscriptionEventPayloadFieldNames[type],
        context,
    });
    authenticatedSelections.forEach(({ entity, fieldSelection }) => checkAuthenticationOnSelection({ entity, fieldSelection, context }));
}
exports.checkAuthenticationOnSelectionSet = checkAuthenticationOnSelectionSet;
function checkAuthenticationOnSelection({ fieldSelection, entity, context, }) {
    (0, check_authentication_1.checkAuthentication)({ authenticated: entity, operation: "READ", context });
    for (const selectedField of Object.values(fieldSelection)) {
        const field = entity.attributes.get(selectedField.name);
        if (field) {
            (0, check_authentication_1.checkAuthentication)({ authenticated: field, operation: "READ", context });
        }
    }
}
//# sourceMappingURL=check-authentication-selection-set.js.map