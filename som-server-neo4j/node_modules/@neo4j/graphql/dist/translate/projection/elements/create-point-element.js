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
exports.createPointExpression = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const get_or_create_cypher_variable_1 = require("../../utils/get-or-create-cypher-variable");
const compile_cypher_1 = require("../../../utils/compile-cypher");
function createPointElement({ resolveTree, field, variable, }) {
    const expression = createPointExpression({ resolveTree, field, variable });
    const cypherClause = new cypher_builder_1.default.RawCypher((env) => {
        return (0, compile_cypher_1.compileCypher)(expression, env);
    });
    const { cypher } = cypherClause.build("p_");
    return new cypher_builder_1.default.RawCypher(`${resolveTree.alias}: (${cypher})`);
}
exports.default = createPointElement;
function createPointExpression({ resolveTree, field, variable, }) {
    const isArray = field.typeMeta.array;
    const { crs, ...point } = resolveTree.fieldsByTypeName[field.typeMeta.name];
    const dbFieldName = field.dbPropertyName || resolveTree.name;
    const CypherVariable = (0, get_or_create_cypher_variable_1.getOrCreateCypherVariable)(variable);
    // Sadly need to select the whole point object due to the risk of height/z
    // being selected on a 2D point, to which the database will throw an error
    let caseResult;
    if (isArray) {
        const projectionVar = new cypher_builder_1.default.Variable();
        const projectionMap = createPointProjectionMap({
            variableOrProperty: projectionVar,
            crs,
            point,
        });
        caseResult = new cypher_builder_1.default.ListComprehension(projectionVar)
            .in(CypherVariable.property(dbFieldName))
            .map(projectionMap);
    }
    else {
        caseResult = createPointProjectionMap({
            variableOrProperty: CypherVariable.property(dbFieldName),
            crs,
            point,
        });
    }
    return new cypher_builder_1.default.Case()
        .when(cypher_builder_1.default.isNotNull(CypherVariable.property(dbFieldName)))
        .then(caseResult)
        .else(cypher_builder_1.default.Null);
}
exports.createPointExpression = createPointExpression;
function createPointProjectionMap({ variableOrProperty, crs, point, }) {
    const projectionMap = new cypher_builder_1.default.Map();
    if (point) {
        projectionMap.set({ point: variableOrProperty });
    }
    if (crs) {
        projectionMap.set({ crs: variableOrProperty.property("crs") });
    }
    return projectionMap;
}
//# sourceMappingURL=create-point-element.js.map