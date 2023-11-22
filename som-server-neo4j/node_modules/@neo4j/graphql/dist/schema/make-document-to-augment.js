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
exports.makeDocumentToAugment = void 0;
const graphql_1 = require("graphql");
const get_field_type_meta_1 = __importDefault(require("./get-field-type-meta"));
function makeDocumentToAugment(document) {
    const jwtTypeDefinitions = [];
    const definitions = [];
    for (const definition of document.definitions) {
        if (definition.kind === graphql_1.Kind.OBJECT_TYPE_DEFINITION &&
            (definition.directives || []).some((x) => x.name.value === "jwt")) {
            jwtTypeDefinitions.push(definition);
        }
        else {
            definitions.push(definition);
        }
    }
    const jwt = parseJwtPayload(jwtTypeDefinitions);
    return {
        document: {
            ...document,
            definitions,
        },
        typesExcludedFromGeneration: jwt ? { jwt } : {},
    };
}
exports.makeDocumentToAugment = makeDocumentToAugment;
function parseJwtPayload(jwtAnnotatedTypes) {
    const jwtFieldsMap = new Map();
    if (jwtAnnotatedTypes.length > 1) {
        throw new Error(`@jwt directive can only be used once in the Type Definitions.`);
    }
    const jwt = jwtAnnotatedTypes[0];
    if (!jwt) {
        return undefined;
    }
    if ((jwt?.directives || []).length > 1) {
        throw new Error(`@jwt directive cannot be combined with other directives.`);
    }
    jwt?.fields?.forEach((f) => {
        const typeMeta = (0, get_field_type_meta_1.default)(f.type);
        if (!["String", "ID", "Int", "Float", "Boolean"].includes(typeMeta.name)) {
            throw new Error("fields of a @jwt type can only be Scalars or Lists of Scalars.");
        }
        const fieldName = f.name.value;
        const jwtClaimDirective = f.directives?.find((x) => x.name.value === "jwtClaim");
        if (!jwtClaimDirective) {
            jwtFieldsMap.set(fieldName, fieldName);
        }
        else {
            const claimPathArgument = jwtClaimDirective.arguments?.find((a) => a.name.value === "path")?.value;
            if (!claimPathArgument || claimPathArgument.kind !== graphql_1.Kind.STRING) {
                throw new Error(`@jwtClaim path argument required and must be a String.`);
            }
            jwtFieldsMap.set(fieldName, claimPathArgument.value);
        }
    });
    return { type: jwt, jwtFieldsMap };
}
//# sourceMappingURL=make-document-to-augment.js.map