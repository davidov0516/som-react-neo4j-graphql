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
const graphql_1 = require("graphql");
const pluralize_1 = __importDefault(require("pluralize"));
const scalars = __importStar(require("../../graphql/scalars"));
const directives = __importStar(require("../../graphql/directives"));
const SortDirection_1 = require("../../graphql/enums/SortDirection");
const Point_1 = require("../../graphql/objects/Point");
const CartesianPoint_1 = require("../../graphql/objects/CartesianPoint");
const PointInput_1 = require("../../graphql/input-objects/PointInput");
const CartesianPointInput_1 = require("../../graphql/input-objects/CartesianPointInput");
const PointDistance_1 = require("../../graphql/input-objects/PointDistance");
const CartesianPointDistance_1 = require("../../graphql/input-objects/CartesianPointDistance");
const is_root_type_1 = require("../../utils/is-root-type");
const validate_schema_customizations_1 = require("./validate-schema-customizations");
const validate_sdl_1 = require("./validate-sdl");
const specifiedRules_1 = require("graphql/validation/specifiedRules");
const directive_argument_of_correct_type_1 = require("./custom-rules/directive-argument-of-correct-type");
const valid_directive_combination_1 = require("./custom-rules/valid-types/valid-directive-combination");
const valid_jwt_directives_1 = require("./custom-rules/features/valid-jwt-directives");
const valid_field_types_1 = require("./custom-rules/valid-types/valid-field-types");
const reserved_type_names_1 = require("./custom-rules/valid-types/reserved-type-names");
const valid_relay_id_1 = require("./custom-rules/features/valid-relay-id");
const valid_object_type_1 = require("./custom-rules/valid-types/valid-object-type");
const directive_multiple_inheritance_1 = require("./custom-rules/valid-types/directive-multiple-inheritance");
const valid_directive_1 = require("./custom-rules/directives/valid-directive");
const valid_relationship_properties_1 = require("./custom-rules/features/valid-relationship-properties");
const scaffolds_1 = require("../../graphql/directives/type-dependant-directives/scaffolds");
const valid_directive_field_location_1 = require("./custom-rules/directives/valid-directive-field-location");
const authorization_feature_disabled_1 = require("./custom-rules/warnings/authorization-feature-disabled");
const list_of_lists_1 = require("./custom-rules/warnings/list-of-lists");
function filterDocument(document) {
    const nodeNames = document.definitions
        .filter((definition) => {
        if (definition.kind === graphql_1.Kind.OBJECT_TYPE_DEFINITION) {
            if (!(0, is_root_type_1.isRootType)(definition)) {
                return true;
            }
        }
        return false;
    })
        .map((definition) => definition.name.value);
    const getArgumentType = (type) => {
        if (type.kind === graphql_1.Kind.LIST_TYPE) {
            return getArgumentType(type.type);
        }
        if (type.kind === graphql_1.Kind.NON_NULL_TYPE) {
            return getArgumentType(type.type);
        }
        return type.name.value;
    };
    const filterInputTypes = (fields) => {
        return fields?.filter((f) => {
            const type = getArgumentType(f.type);
            const nodeMatch = /(?<nodeName>.+)(?:ConnectInput|ConnectWhere|CreateInput|DeleteInput|DisconnectInput|Options|RelationInput|Sort|UpdateInput|Where)/gm.exec(type);
            if (nodeMatch?.groups?.nodeName) {
                if (nodeNames.includes(nodeMatch.groups.nodeName)) {
                    return false;
                }
            }
            return true;
        });
    };
    const filterFields = (fields) => {
        return fields
            ?.filter((field) => {
            const type = getArgumentType(field.type);
            const match = /(?:Create|Update)(?<nodeName>.+)MutationResponse/gm.exec(type);
            if (match?.groups?.nodeName) {
                if (nodeNames.map((nodeName) => (0, pluralize_1.default)(nodeName)).includes(match.groups.nodeName)) {
                    return false;
                }
            }
            return true;
        })
            .map((field) => {
            return {
                ...field,
                arguments: filterInputTypes(field.arguments),
            };
        });
    };
    const filteredDocument = {
        ...document,
        definitions: document.definitions.reduce((res, def) => {
            if (def.kind === graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION) {
                const fields = filterInputTypes(def.fields);
                if (!fields?.length) {
                    return res;
                }
                return [
                    ...res,
                    {
                        ...def,
                        fields,
                    },
                ];
            }
            if (def.kind === graphql_1.Kind.OBJECT_TYPE_DEFINITION || def.kind === graphql_1.Kind.INTERFACE_TYPE_DEFINITION) {
                if (!def.fields?.length) {
                    return [...res, def];
                }
                const fields = filterFields(def.fields);
                if (!fields?.length) {
                    return res;
                }
                return [
                    ...res,
                    {
                        ...def,
                        fields,
                    },
                ];
            }
            return [...res, def];
        }, []),
    };
    return filteredDocument;
}
function runValidationRulesOnFilteredDocument({ schema, document, extra, features, }) {
    const errors = (0, validate_sdl_1.validateSDL)(document, [
        ...specifiedRules_1.specifiedSDLRules,
        (0, valid_directive_1.directiveIsValid)(extra, features?.populatedBy?.callbacks),
        valid_directive_field_location_1.ValidDirectiveAtFieldLocation,
        valid_directive_combination_1.DirectiveCombinationValid,
        valid_directive_combination_1.SchemaOrTypeDirectives,
        valid_jwt_directives_1.ValidJwtDirectives,
        valid_relay_id_1.ValidRelayID,
        valid_relationship_properties_1.ValidRelationshipProperties,
        valid_field_types_1.ValidFieldTypes,
        reserved_type_names_1.ReservedTypeNames,
        valid_object_type_1.ValidObjectType,
        directive_multiple_inheritance_1.ValidDirectiveInheritance,
        (0, directive_argument_of_correct_type_1.DirectiveArgumentOfCorrectType)(false),
        (0, authorization_feature_disabled_1.WarnIfAuthorizationFeatureDisabled)(features?.authorization),
        list_of_lists_1.WarnIfListOfListsFieldDefinition,
    ], schema);
    const filteredErrors = errors.filter((e) => e.message !== "Query root type must be provided.");
    if (filteredErrors.length) {
        throw filteredErrors;
    }
}
function validateDocument({ document, features, additionalDefinitions, }) {
    const filteredDocument = filterDocument(document);
    const { additionalDirectives, additionalTypes, ...extra } = additionalDefinitions;
    const schemaToExtend = new graphql_1.GraphQLSchema({
        directives: [
            ...Object.values(directives),
            ...scaffolds_1.typeDependantDirectivesScaffolds,
            ...graphql_1.specifiedDirectives,
            ...(additionalDirectives || []),
        ],
        types: [
            ...Object.values(scalars),
            Point_1.Point,
            CartesianPoint_1.CartesianPoint,
            PointInput_1.PointInput,
            PointDistance_1.PointDistance,
            CartesianPointInput_1.CartesianPointInput,
            CartesianPointDistance_1.CartesianPointDistance,
            SortDirection_1.SortDirection,
            ...(additionalTypes || []),
        ],
    });
    runValidationRulesOnFilteredDocument({
        schema: schemaToExtend,
        document: filteredDocument,
        extra,
        features,
    });
    const schema = (0, graphql_1.extendSchema)(schemaToExtend, filteredDocument);
    const errors = (0, graphql_1.validateSchema)(schema);
    const filteredErrors = errors.filter((e) => e.message !== "Query root type must be provided.");
    if (filteredErrors.length) {
        throw filteredErrors;
    }
    // TODO: how to improve this??
    // validates `@customResolver`
    (0, validate_schema_customizations_1.validateSchemaCustomizations)({ document, schema });
}
exports.default = validateDocument;
//# sourceMappingURL=validate-document.js.map