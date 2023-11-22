"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertArgumentHasSameTypeAsField = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("./utils");
const constants_1 = require("../../../../constants");
const document_validation_error_1 = require("./document-validation-error");
function assertArgumentHasSameTypeAsField({ directiveName, traversedDef, argument, enums, }) {
    const expectedType = (0, utils_1.getInnerTypeName)(traversedDef.type);
    if ((0, utils_1.isArrayType)(traversedDef)) {
        if (argument.value.kind !== graphql_1.Kind.LIST) {
            throw new document_validation_error_1.DocumentValidationError(`${directiveName}.${argument.name.value} on ${expectedType} list fields must be a list of ${expectedType} values`, [argument.name.value]);
        }
        argument.value.values.forEach((v) => {
            if (!v) {
                // delegate to DirectiveArgumentOfCorrectType rule
                return;
            }
            if (!doTypesMatch(expectedType, v, enums)) {
                throw new document_validation_error_1.DocumentValidationError(`${directiveName}.${argument.name.value} on ${expectedType} list fields must be a list of ${expectedType} values`, [argument.name.value]);
            }
        });
    }
    else {
        if (!doTypesMatch(expectedType, argument.value, enums)) {
            throw new document_validation_error_1.DocumentValidationError(`${directiveName}.${argument.name.value} on ${expectedType} fields must be of type ${expectedType}`, [argument.name.value]);
        }
    }
}
exports.assertArgumentHasSameTypeAsField = assertArgumentHasSameTypeAsField;
function doTypesMatch(expectedType, argumentValueType, enums) {
    const isSpatialOrTemporal = (0, constants_1.isSpatial)(expectedType) || (0, constants_1.isTemporal)(expectedType);
    if (isSpatialOrTemporal) {
        return true;
    }
    if (expectedType.toLowerCase() === "id") {
        return !!((0, utils_1.fromValueKind)(argumentValueType, enums, expectedType)?.toLowerCase() === "string");
    }
    return (0, utils_1.fromValueKind)(argumentValueType, enums, expectedType)?.toLowerCase() === expectedType.toLowerCase();
}
//# sourceMappingURL=same-type-argument-as-field.js.map