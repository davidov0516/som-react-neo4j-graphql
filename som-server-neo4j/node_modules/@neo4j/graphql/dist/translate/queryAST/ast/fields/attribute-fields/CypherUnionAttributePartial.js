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
exports.CypherUnionAttributePartial = void 0;
const QueryASTNode_1 = require("../../QueryASTNode");
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
class CypherUnionAttributePartial extends QueryASTNode_1.QueryASTNode {
    constructor({ fields, target }) {
        super();
        this.fields = fields;
        this.target = target;
    }
    getChildren() {
        return this.fields;
    }
    getSubqueries(context) {
        return this.fields.flatMap((f) => f.getSubqueries(context));
    }
    getProjectionExpression(variable) {
        const projection = new cypher_builder_1.default.MapProjection(variable);
        this.setSubqueriesProjection(projection, this.fields, variable);
        projection.set({
            __resolveType: new cypher_builder_1.default.Literal(this.target.name),
        });
        return projection;
    }
    getFilterPredicate(variable) {
        const labels = this.target.getLabels();
        // TODO: Refactor when `.hasLabel` on variables is supported in CypherBuilder
        const predicates = labels.map((label) => {
            return new cypher_builder_1.default.RawCypher((env) => {
                const varName = env.compile(variable);
                const labelStr = cypher_builder_1.default.utils.escapeLabel(label);
                return `${varName}:${labelStr}`;
            });
        });
        return cypher_builder_1.default.and(...predicates);
    }
    setSubqueriesProjection(projection, fields, fromVariable) {
        const subqueriesProjection = fields?.map((f) => f.getProjectionField(fromVariable));
        for (const subqueryProjection of subqueriesProjection) {
            projection.set(subqueryProjection);
        }
    }
}
exports.CypherUnionAttributePartial = CypherUnionAttributePartial;
//# sourceMappingURL=CypherUnionAttributePartial.js.map