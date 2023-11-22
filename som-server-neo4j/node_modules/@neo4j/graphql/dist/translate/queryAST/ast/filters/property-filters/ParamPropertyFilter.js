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
exports.ParamPropertyFilter = void 0;
const cypher_builder_1 = __importDefault(require("@neo4j/cypher-builder"));
const PropertyFilter_1 = require("./PropertyFilter");
/** A property which comparison has already been parsed into a Param */
class ParamPropertyFilter extends PropertyFilter_1.PropertyFilter {
    constructor(options) {
        super(options);
        this.comparisonValue = options.comparisonValue;
    }
    getPredicate(queryASTContext) {
        const predicate = super.getPredicate(queryASTContext);
        // NOTE: Should this check be a different Filter?
        return cypher_builder_1.default.and(cypher_builder_1.default.isNotNull(this.comparisonValue), predicate);
    }
    getOperation(prop) {
        const comparisonParam = this.comparisonValue;
        return this.createBaseOperation({
            operator: this.operator,
            property: prop,
            param: comparisonParam,
        });
    }
}
exports.ParamPropertyFilter = ParamPropertyFilter;
//# sourceMappingURL=ParamPropertyFilter.js.map