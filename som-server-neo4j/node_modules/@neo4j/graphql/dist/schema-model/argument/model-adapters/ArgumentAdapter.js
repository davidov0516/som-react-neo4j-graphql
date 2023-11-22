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
exports.ArgumentAdapter = void 0;
const AttributeType_1 = require("../../attribute/AttributeType");
// TODO: this file has a lot in common with AttributeAdapter
// if going to use this, design a solution to avoid this code duplication
class ArgumentAdapter {
    constructor(argument) {
        this.name = argument.name;
        this.type = argument.type;
        this.defaultValue = argument.defaultValue;
        this.description = argument.description;
        this.assertionOptions = {
            includeLists: true,
        };
    }
    /**
     * Just a helper to get the wrapped type in case of a list, useful for the assertions
     */
    getTypeForAssertion(includeLists) {
        if (includeLists) {
            return this.isList() ? this.type.ofType : this.type;
        }
        return this.type;
    }
    isBoolean(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.ScalarType && type.name === AttributeType_1.GraphQLBuiltInScalarType.Boolean;
    }
    isID(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.ScalarType && type.name === AttributeType_1.GraphQLBuiltInScalarType.ID;
    }
    isInt(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.ScalarType && type.name === AttributeType_1.GraphQLBuiltInScalarType.Int;
    }
    isFloat(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.ScalarType && type.name === AttributeType_1.GraphQLBuiltInScalarType.Float;
    }
    isString(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.ScalarType && type.name === AttributeType_1.GraphQLBuiltInScalarType.String;
    }
    isCartesianPoint(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.Neo4jCartesianPointType;
    }
    isPoint(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.Neo4jPointType;
    }
    isBigInt(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.ScalarType && type.name === AttributeType_1.Neo4jGraphQLNumberType.BigInt;
    }
    isDate(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.ScalarType && type.name === AttributeType_1.Neo4jGraphQLTemporalType.Date;
    }
    isDateTime(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.ScalarType && type.name === AttributeType_1.Neo4jGraphQLTemporalType.DateTime;
    }
    isLocalDateTime(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.ScalarType && type.name === AttributeType_1.Neo4jGraphQLTemporalType.LocalDateTime;
    }
    isTime(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.ScalarType && type.name === AttributeType_1.Neo4jGraphQLTemporalType.Time;
    }
    isLocalTime(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name === AttributeType_1.Neo4jGraphQLTemporalType.LocalTime;
    }
    isDuration(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name === AttributeType_1.Neo4jGraphQLTemporalType.Duration;
    }
    isObject(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.ObjectType;
    }
    isEnum(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.EnumType;
    }
    isInterface(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.InterfaceType;
    }
    isUnion(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.UnionType;
    }
    isList() {
        return this.type instanceof AttributeType_1.ListType;
    }
    isUserScalar(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.UserScalarType;
    }
    isTemporal(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name in AttributeType_1.Neo4jGraphQLTemporalType;
    }
    isListElementRequired() {
        if (!(this.type instanceof AttributeType_1.ListType)) {
            return false;
        }
        return this.type.ofType.isRequired;
    }
    isRequired() {
        return this.type.isRequired;
    }
    /**
     *
     * Schema Generator Stuff
     *
     */
    isGraphQLBuiltInScalar(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name in AttributeType_1.GraphQLBuiltInScalarType;
    }
    isSpatial(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name in AttributeType_1.Neo4jGraphQLSpatialType;
    }
    isAbstract(options = this.assertionOptions) {
        return this.isInterface(options) || this.isUnion(options);
    }
    /**
     * Returns true for both built-in and user-defined scalars
     **/
    isScalar(options = this.assertionOptions) {
        return (this.isGraphQLBuiltInScalar(options) ||
            this.isTemporal(options) ||
            this.isBigInt(options) ||
            this.isUserScalar(options));
    }
    isNumeric(options = this.assertionOptions) {
        return this.isBigInt(options) || this.isFloat(options) || this.isInt(options);
    }
    /**
     *  END of category assertions
     */
    /**
     *
     * Schema Generator Stuff
     *
     */
    getTypePrettyName() {
        if (this.isList()) {
            return `[${this.getTypeName()}${this.isListElementRequired() ? "!" : ""}]${this.isRequired() ? "!" : ""}`;
        }
        return `${this.getTypeName()}${this.isRequired() ? "!" : ""}`;
    }
    getTypeName() {
        return this.isList() ? this.type.ofType.name : this.type.name;
    }
}
exports.ArgumentAdapter = ArgumentAdapter;
//# sourceMappingURL=ArgumentAdapter.js.map