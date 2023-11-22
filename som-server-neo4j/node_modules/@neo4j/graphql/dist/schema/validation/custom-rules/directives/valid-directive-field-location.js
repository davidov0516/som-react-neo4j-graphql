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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidDirectiveAtFieldLocation = void 0;
const graphql_1 = require("graphql");
const document_validation_error_1 = require("../utils/document-validation-error");
const path_parser_1 = require("../utils/path-parser");
const directives = __importStar(require("../../../../graphql/directives"));
const scaffolds_1 = require("../../../../graphql/directives/type-dependant-directives/scaffolds");
/** only the @cypher directive is valid on fields of Root types: Query, Mutation; no directives valid on fields of Subscription */
function ValidDirectiveAtFieldLocation(context) {
    return {
        Directive(directiveNode, _key, _parent, path, ancestors) {
            const [pathToNode, traversedDef, parentOfTraversedDef] = (0, path_parser_1.getPathToNode)(path, ancestors);
            if (!traversedDef || traversedDef.kind !== graphql_1.Kind.FIELD_DEFINITION) {
                // this rule only checks field location
                return;
            }
            if (!parentOfTraversedDef) {
                console.error("No parent of last definition traversed");
                return;
            }
            const shouldRunThisRule = isDirectiveValidAtLocation({
                directiveNode,
                traversedDef,
                parentDef: parentOfTraversedDef,
            });
            if (!shouldRunThisRule) {
                return;
            }
            const { isValid, errorMsg, errorPath } = (0, document_validation_error_1.assertValid)(shouldRunThisRule);
            if (!isValid) {
                context.reportError((0, document_validation_error_1.createGraphQLError)({
                    nodes: [traversedDef],
                    path: [...pathToNode, ...errorPath],
                    errorMsg,
                }));
            }
        },
    };
}
exports.ValidDirectiveAtFieldLocation = ValidDirectiveAtFieldLocation;
function isDirectiveValidAtLocation({ directiveNode, traversedDef, parentDef, }) {
    if (isLocationFieldOfRootType(parentDef)) {
        return () => validFieldOfRootTypeLocation({
            directiveNode,
            traversedDef: traversedDef,
            parentDef,
        });
    }
    return;
}
function isLocationFieldOfRootType(parentDef) {
    return (parentDef &&
        (parentDef.kind === graphql_1.Kind.OBJECT_TYPE_DEFINITION || parentDef.kind === graphql_1.Kind.OBJECT_TYPE_EXTENSION) &&
        ["Query", "Mutation", "Subscription"].includes(parentDef.name.value));
}
function noDirectivesAllowedAtLocation({ directiveNode, parentDef, }) {
    const allDirectivesDefinedByNeo4jGraphQL = Object.values(directives).concat(scaffolds_1.typeDependantDirectivesScaffolds);
    const directiveAtInvalidLocation = allDirectivesDefinedByNeo4jGraphQL.find((d) => d.name === directiveNode.name.value);
    if (directiveAtInvalidLocation) {
        throw new document_validation_error_1.DocumentValidationError(`Invalid directive usage: Directive @${directiveAtInvalidLocation.name} is not supported on fields of the ${parentDef.name.value} type.`, [`@${directiveNode.name.value}`]);
    }
}
function validFieldOfRootTypeLocation({ directiveNode, traversedDef, parentDef, }) {
    if (parentDef.name.value !== "Subscription") {
        // some directives are valid on Query | Mutation
        if (directiveNode.name.value === "cypher") {
            // @cypher is valid
            return;
        }
        const isDirectiveCombinedWithCypher = traversedDef.directives?.some((directive) => directive.name.value === "cypher");
        if (directiveNode.name.value === "authentication" && isDirectiveCombinedWithCypher) {
            // @cypher @authentication combo is valid
            return;
        }
        // explicitly checked for "enhanced" error messages
        if (directiveNode.name.value === "authentication" && !isDirectiveCombinedWithCypher) {
            throw new document_validation_error_1.DocumentValidationError(`Invalid directive usage: Directive @authentication is not supported on fields of the ${parentDef.name.value} type unless it is a @cypher field.`, [`@${directiveNode.name.value}`]);
        }
        if (directiveNode.name.value === "authorization" && isDirectiveCombinedWithCypher) {
            throw new document_validation_error_1.DocumentValidationError(`Invalid directive usage: Directive @authorization is not supported on fields of the ${parentDef.name.value} type. Did you mean to use @authentication?`, [`@${directiveNode.name.value}`]);
        }
    }
    noDirectivesAllowedAtLocation({ directiveNode, parentDef });
}
//# sourceMappingURL=valid-directive-field-location.js.map