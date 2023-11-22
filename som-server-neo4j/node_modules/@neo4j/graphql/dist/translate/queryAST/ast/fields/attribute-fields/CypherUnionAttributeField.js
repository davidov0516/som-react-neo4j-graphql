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
exports.CypherUnionAttributeField = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const CypherAnnotationSubqueryGenerator_1 = require("../../../cypher-generators/CypherAnnotationSubqueryGenerator");
const CypherAttributeField_1 = require("./CypherAttributeField");
const utils_1 = require("../../../../../utils/utils");
// Should Cypher be an operation?
class CypherUnionAttributeField extends CypherAttributeField_1.CypherAttributeField {
    constructor({ alias, attribute, projection, unionPartials, rawArguments = {}, extraParams = {}, }) {
        super({ alias, attribute, projection, nestedFields: [], rawArguments, extraParams });
        this.unionPartials = unionPartials;
    }
    getChildren() {
        return [...super.getChildren(), ...this.unionPartials];
    }
    getSubqueries(context) {
        const scope = context.getTargetScope();
        scope.set(this.attribute.name, this.customCypherVar);
        // TODO: this logic may be needed in normal Cypher Fields
        // This handles nested subqueries for union cypher
        const nestedSubqueries = this.unionPartials.flatMap((p) => {
            const innerNode = new cypher_builder_1.default.Node();
            const nestedContext = context.push({
                target: innerNode,
                relationship: new cypher_builder_1.default.Relationship(),
            });
            const callSubqueries = p.getSubqueries(nestedContext).map((sq) => {
                return new cypher_builder_1.default.Call(sq).innerWith(innerNode);
            });
            if (callSubqueries.length === 0)
                return undefined;
            const withClause = new cypher_builder_1.default.With("*", [this.customCypherVar, innerNode]);
            return cypher_builder_1.default.concat(withClause, ...callSubqueries);
        });
        const cypherGenerator = new CypherAnnotationSubqueryGenerator_1.CypherAnnotationSubqueryGenerator({
            context,
            attribute: this.attribute,
        });
        // TODO: use different method
        const subquery = cypherGenerator.createSubqueryForCypherAnnotationUnion({
            // projectionFields: this.projection,
            nestedFields: this.nestedFields,
            rawArguments: this.rawArguments,
            subqueries: (0, utils_1.filterTruthy)(nestedSubqueries),
            extraParams: this.extraParams,
            unionPartials: this.unionPartials,
        });
        return [subquery];
    }
}
exports.CypherUnionAttributeField = CypherUnionAttributeField;
//# sourceMappingURL=CypherUnionAttributeField.js.map