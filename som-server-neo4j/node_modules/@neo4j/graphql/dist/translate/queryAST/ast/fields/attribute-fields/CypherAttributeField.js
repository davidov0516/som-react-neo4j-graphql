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
exports.CypherAttributeField = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const AttributeField_1 = require("./AttributeField");
const CypherAnnotationSubqueryGenerator_1 = require("../../../cypher-generators/CypherAnnotationSubqueryGenerator");
// Should Cypher be an operation?
class CypherAttributeField extends AttributeField_1.AttributeField {
    constructor({ alias, attribute, projection, nestedFields, rawArguments = {}, extraParams = {}, }) {
        super({ alias, attribute });
        this.customCypherVar = new cypher_builder_1.default.Node(); // TODO: should be from context scope
        this.projection = projection;
        this.nestedFields = nestedFields;
        this.rawArguments = rawArguments;
        this.extraParams = extraParams;
    }
    getChildren() {
        return [...super.getChildren(), ...(this.nestedFields || [])];
    }
    getProjectionField(_variable) {
        return { [this.alias]: this.customCypherVar };
    }
    getSubqueries(context) {
        const scope = context.getTargetScope();
        scope.set(this.attribute.name, this.customCypherVar);
        const cypherGenerator = new CypherAnnotationSubqueryGenerator_1.CypherAnnotationSubqueryGenerator({
            context,
            attribute: this.attribute,
        });
        const subquery = cypherGenerator.createSubqueryForCypherAnnotation({
            projectionFields: this.projection,
            nestedFields: this.nestedFields,
            rawArguments: this.rawArguments,
            extraParams: this.extraParams,
        });
        return [subquery];
    }
}
exports.CypherAttributeField = CypherAttributeField;
//# sourceMappingURL=CypherAttributeField.js.map