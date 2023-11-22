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
exports.ValidJwtDirectives = void 0;
const graphql_1 = require("graphql");
const constants_1 = require("../../../../constants");
const document_validation_error_1 = require("../utils/document-validation-error");
const path_parser_1 = require("../utils/path-parser");
const utils_1 = require("../utils/utils");
function ValidJwtDirectives(context) {
    const jwtTypes = new Map();
    const typeMap = new Map();
    const defs = context.getDocument().definitions;
    const objectsAndInterfaces = defs.filter((d) => d.kind === graphql_1.Kind.OBJECT_TYPE_DEFINITION ||
        d.kind === graphql_1.Kind.OBJECT_TYPE_EXTENSION ||
        d.kind === graphql_1.Kind.INTERFACE_TYPE_DEFINITION ||
        d.kind === graphql_1.Kind.INTERFACE_TYPE_EXTENSION);
    for (const def of objectsAndInterfaces) {
        const prev = typeMap.get(def.name.value) || [];
        typeMap.set(def.name.value, prev.concat(def));
        if (def.directives?.some((d) => d.name.value === "jwt")) {
            // first, scaffold with just typenames
            jwtTypes.set(def.name.value, []);
        }
    }
    // second, populate with definitions
    for (const typeName of jwtTypes.keys()) {
        jwtTypes.set(typeName, typeMap.get(typeName) || []);
    }
    return {
        Directive(node, _key, _parent, path, ancestors) {
            const isJwtDirective = node.name.value === "jwt";
            const isJwtClaimDirective = node.name.value === "jwtClaim";
            if (!isJwtDirective && !isJwtClaimDirective) {
                return;
            }
            const [pathToNode, traversedDef, parentOfTraversedDef] = (0, path_parser_1.getPathToNode)(path, ancestors);
            if (!traversedDef) {
                console.error("No last definition traversed");
                return;
            }
            let validationResult;
            let errorPath;
            if (isJwtDirective) {
                if (traversedDef.kind !== graphql_1.Kind.OBJECT_TYPE_DEFINITION &&
                    traversedDef.kind !== graphql_1.Kind.OBJECT_TYPE_EXTENSION) {
                    // delegate to another rule bc cannot use jwt on fields
                    return;
                }
                validationResult = (0, document_validation_error_1.assertValid)(() => assertJwtDirective(traversedDef, jwtTypes));
                errorPath = "@jwt";
            }
            else {
                if (!parentOfTraversedDef) {
                    console.error("No parent of last definition traversed");
                    return;
                }
                validationResult = (0, document_validation_error_1.assertValid)(() => assertJwtClaimDirective(jwtTypes, parentOfTraversedDef));
                errorPath = "@jwtClaim";
            }
            const { isValid, errorMsg } = validationResult;
            if (!isValid) {
                context.reportError((0, document_validation_error_1.createGraphQLError)({
                    nodes: [node, traversedDef],
                    path: [...pathToNode, errorPath],
                    errorMsg,
                }));
            }
        },
    };
}
exports.ValidJwtDirectives = ValidJwtDirectives;
function assertJwtDirective(objectType, jwtTypes) {
    const typeNamesForCurrent = [
        objectType.name.value,
        ...(objectType.interfaces || []).map((i) => i.name.value),
    ];
    for (const typeName of jwtTypes.keys()) {
        if (!typeNamesForCurrent.includes(typeName)) {
            throw new document_validation_error_1.DocumentValidationError(`Invalid directive usage: Directive @jwt can only be used once in the Type Definitions.`, []);
        }
    }
    const mergedDirectivesForCurrent = [];
    for (const typeName of typeNamesForCurrent) {
        const types = jwtTypes.get(typeName);
        if (!types) {
            continue;
        }
        for (const t of types) {
            mergedDirectivesForCurrent.push(...(t.directives || []));
            if (mergedDirectivesForCurrent.length > 1) {
                throw new document_validation_error_1.DocumentValidationError(`Invalid directive usage: Directive @jwt cannot be used in combination with other directives.`, []);
            }
            const incompatibleFieldsStatus = t.fields?.some((field) => !constants_1.GRAPHQL_BUILTIN_SCALAR_TYPES.includes((0, utils_1.getInnerTypeName)(field.type)));
            if (incompatibleFieldsStatus === true) {
                throw new document_validation_error_1.DocumentValidationError(`Invalid directive usage: Fields of a @jwt type can only be Scalars or Lists of Scalars.`, []);
            }
        }
    }
}
function assertJwtClaimDirective(jwtTypes, node) {
    const typeNamesForCurrent = [node.name.value, ...(node.interfaces || []).map((i) => i.name.value)];
    for (const typeName of typeNamesForCurrent) {
        if (jwtTypes.has(typeName)) {
            return;
        }
    }
    throw new document_validation_error_1.DocumentValidationError(`Invalid directive usage: Directive @jwtClaim can only be used in \\"@jwt\\" types.`, []);
}
//# sourceMappingURL=valid-jwt-directives.js.map