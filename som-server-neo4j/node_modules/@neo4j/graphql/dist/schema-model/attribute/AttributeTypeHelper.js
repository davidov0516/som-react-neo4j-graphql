"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeTypeHelper = void 0;
const AttributeType_1 = require("./AttributeType");
class AttributeTypeHelper {
    constructor(type) {
        this.type = type;
        this.assertionOptions = { includeLists: true };
    }
    /**
     * Just an helper to get the wrapped type in readonlyase of a list, useful for the assertions
     */
    getTypeForAssertion(includeLists) {
        if (includeLists) {
            if (!this.isList()) {
                return this.type;
            }
            if (this.type.ofType instanceof AttributeType_1.ListType) {
                return this.type.ofType.ofType;
            }
            return this.type.ofType;
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
    isInput(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof AttributeType_1.InputType;
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
    isNumeric(options = this.assertionOptions) {
        return this.isBigInt(options) || this.isFloat(options) || this.isInt(options);
    }
    /**
     * Returns true for both built-in and user-defined scalars
     **/
    isScalar(options = this.assertionOptions) {
        return (this.isGraphQLBuiltInScalar(options) ||
            this.isTemporal(options) ||
            this.isBigInt(options) ||
            this.isUserScalar(options) ||
            this.isInput(options));
    }
}
exports.AttributeTypeHelper = AttributeTypeHelper;
//# sourceMappingURL=AttributeTypeHelper.js.map