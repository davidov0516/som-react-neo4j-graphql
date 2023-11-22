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
exports.validateSchemaCustomizations = void 0;
const get_definition_nodes_1 = require("../get-definition-nodes");
const validate_custom_resolver_requires_1 = require("./validate-custom-resolver-requires");
function validateSchemaCustomizations({ document, schema }) {
    const definitionNodes = (0, get_definition_nodes_1.getDefinitionNodes)(document);
    for (const objectType of definitionNodes.objectTypes) {
        (0, validate_custom_resolver_requires_1.validateCustomResolverRequires)(objectType, schema);
    }
}
exports.validateSchemaCustomizations = validateSchemaCustomizations;
//# sourceMappingURL=validate-schema-customizations.js.map