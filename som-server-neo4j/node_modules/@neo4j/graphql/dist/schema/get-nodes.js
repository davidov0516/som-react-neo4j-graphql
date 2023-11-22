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
const classes_1 = require("../classes");
const utils_1 = require("../utils/utils");
const get_obj_field_meta_1 = __importDefault(require("./get-obj-field-meta"));
const parse_exclude_directive_1 = __importDefault(require("./parse-exclude-directive"));
const parse_node_directive_1 = __importDefault(require("./parse-node-directive"));
const parse_fulltext_directive_1 = __importDefault(require("./parse/parse-fulltext-directive"));
const parse_plural_directive_1 = __importDefault(require("./parse/parse-plural-directive"));
const parse_limit_directive_1 = require("./parse/parse-limit-directive");
const schema_configuration_1 = require("./schema-configuration");
function getNodes(definitionNodes, options) {
    let pointInTypeDefs = false;
    let cartesianPointInTypeDefs = false;
    let floatWhereInTypeDefs = false;
    const relationshipPropertyInterfaceNames = new Set();
    const interfaceRelationshipNames = new Set();
    const nodes = definitionNodes.objectTypes.map((definition) => {
        const otherDirectives = (definition.directives || []).filter((x) => ![
            "authorization",
            "authentication",
            "exclude",
            "node",
            "fulltext",
            "limit",
            "plural",
            "shareable",
            "subscriptionsAuthorization",
            "deprecated",
            "query",
            "mutation",
            "subscription",
            "jwt",
        ].includes(x.name.value));
        const propagatedDirectives = (definition.directives || []).filter((x) => ["deprecated", "shareable"].includes(x.name.value));
        const excludeDirective = (definition.directives || []).find((x) => x.name.value === "exclude");
        const nodeDirectiveDefinition = (definition.directives || []).find((x) => x.name.value === "node");
        const pluralDirectiveDefinition = (definition.directives || []).find((x) => x.name.value === "plural");
        const fulltextDirectiveDefinition = (definition.directives || []).find((x) => x.name.value === "fulltext");
        const limitDirectiveDefinition = (definition.directives || []).find((x) => x.name.value === "limit");
        const nodeInterfaces = [...(definition.interfaces || [])];
        const { interfaceExcludeDirectives } = nodeInterfaces.reduce((res, interfaceName) => {
            const iface = definitionNodes.interfaceTypes.find((i) => i.name.value === interfaceName.name.value);
            if (iface) {
                const interfaceExcludeDirective = (iface.directives || []).find((x) => x.name.value === "exclude");
                if (interfaceExcludeDirective) {
                    res.interfaceExcludeDirectives.push(interfaceExcludeDirective);
                }
            }
            return res;
        }, { interfaceAuthDirectives: [], interfaceExcludeDirectives: [] });
        let exclude;
        if (excludeDirective || interfaceExcludeDirectives.length) {
            exclude = (0, parse_exclude_directive_1.default)(excludeDirective || interfaceExcludeDirectives[0]);
        }
        const schemaConfiguration = (0, schema_configuration_1.schemaConfigurationFromObjectTypeDefinition)(definition);
        let nodeDirective;
        if (nodeDirectiveDefinition) {
            nodeDirective = (0, parse_node_directive_1.default)(nodeDirectiveDefinition);
        }
        const userCustomResolvers = (0, utils_1.asArray)(options.userCustomResolvers);
        const customResolvers = userCustomResolvers.find((r) => !!r[definition.name.value])?.[definition.name.value];
        const nodeFields = (0, get_obj_field_meta_1.default)({
            obj: definition,
            enums: definitionNodes.enumTypes,
            interfaces: definitionNodes.interfaceTypes,
            objects: definitionNodes.objectTypes,
            scalars: definitionNodes.scalarTypes,
            unions: definitionNodes.unionTypes,
            callbacks: options.callbacks,
            customResolvers,
        });
        let fulltextDirective;
        if (fulltextDirectiveDefinition) {
            fulltextDirective = (0, parse_fulltext_directive_1.default)({
                directive: fulltextDirectiveDefinition,
                nodeFields,
                definition,
            });
            floatWhereInTypeDefs = true;
        }
        let limitDirective;
        if (limitDirectiveDefinition) {
            limitDirective = (0, parse_limit_directive_1.parseLimitDirective)({
                directive: limitDirectiveDefinition,
                definition,
            });
        }
        nodeFields.relationFields.forEach((relationship) => {
            if (relationship.properties) {
                relationshipPropertyInterfaceNames.add(relationship.properties);
            }
            if (relationship.interface) {
                interfaceRelationshipNames.add(relationship.typeMeta.name);
            }
        });
        if (!pointInTypeDefs) {
            pointInTypeDefs = nodeFields.pointFields.some((field) => field.typeMeta.name === "Point");
        }
        if (!cartesianPointInTypeDefs) {
            cartesianPointInTypeDefs = nodeFields.pointFields.some((field) => field.typeMeta.name === "CartesianPoint");
        }
        const globalIdFields = nodeFields.primitiveFields.filter((field) => field.isGlobalIdField);
        const globalIdField = globalIdFields[0];
        const node = new classes_1.Node({
            name: definition.name.value,
            interfaces: nodeInterfaces,
            otherDirectives,
            propagatedDirectives,
            ...nodeFields,
            // @ts-ignore we can be sure it's defined
            exclude,
            schemaConfiguration,
            // @ts-ignore we can be sure it's defined
            nodeDirective,
            // @ts-ignore we can be sure it's defined
            fulltextDirective,
            limitDirective,
            description: definition.description?.value,
            isGlobalNode: Boolean(globalIdField),
            globalIdField: globalIdField?.fieldName,
            globalIdFieldIsInt: globalIdField?.typeMeta?.name === "Int",
            plural: (0, parse_plural_directive_1.default)(pluralDirectiveDefinition),
        });
        return node;
    });
    return {
        nodes,
        pointInTypeDefs,
        cartesianPointInTypeDefs,
        floatWhereInTypeDefs,
        relationshipPropertyInterfaceNames,
        interfaceRelationshipNames,
    };
}
exports.default = getNodes;
//# sourceMappingURL=get-nodes.js.map