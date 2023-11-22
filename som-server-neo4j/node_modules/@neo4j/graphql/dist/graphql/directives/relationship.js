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
exports.relationshipDirective = exports.defaultNestedOperations = void 0;
const graphql_1 = require("graphql");
const constants_1 = require("../../constants");
const RelationshipDirection_1 = require("./arguments/enums/RelationshipDirection");
const RelationshipNestedOperations_1 = require("./arguments/enums/RelationshipNestedOperations");
const RelationshipQueryDirection_1 = require("./arguments/enums/RelationshipQueryDirection");
exports.defaultNestedOperations = [
    constants_1.RelationshipNestedOperationsOption.CREATE,
    constants_1.RelationshipNestedOperationsOption.UPDATE,
    constants_1.RelationshipNestedOperationsOption.DELETE,
    constants_1.RelationshipNestedOperationsOption.CONNECT,
    constants_1.RelationshipNestedOperationsOption.DISCONNECT,
    constants_1.RelationshipNestedOperationsOption.CONNECT_OR_CREATE,
];
exports.relationshipDirective = new graphql_1.GraphQLDirective({
    name: "relationship",
    description: "Instructs @neo4j/graphql to treat this field as a relationship. Opens up the ability to create and connect on this field.",
    locations: [graphql_1.DirectiveLocation.FIELD_DEFINITION],
    args: {
        type: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
        },
        queryDirection: {
            type: RelationshipQueryDirection_1.RelationshipQueryDirectionEnum,
            defaultValue: constants_1.RelationshipQueryDirectionOption.DEFAULT_DIRECTED,
            description: "Valid and default directions for this relationship.",
        },
        direction: {
            type: new graphql_1.GraphQLNonNull(RelationshipDirection_1.RelationshipDirectionEnum),
        },
        properties: {
            type: graphql_1.GraphQLString,
            description: "The name of the interface containing the properties for this relationship.",
        },
        nestedOperations: {
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(RelationshipNestedOperations_1.RelationshipNestedOperationsEnum))),
            defaultValue: exports.defaultNestedOperations,
            description: "Prevent all but these operations from being generated for this relationship",
        },
        aggregate: {
            type: graphql_1.GraphQLBoolean,
            defaultValue: true,
            description: "Prevent aggregation for this relationship",
        },
    },
});
//# sourceMappingURL=relationship.js.map