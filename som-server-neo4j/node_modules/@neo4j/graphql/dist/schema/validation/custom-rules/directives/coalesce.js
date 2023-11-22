"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCoalesce = void 0;
const graphql_1 = require("graphql");
const same_type_argument_as_field_1 = require("../utils/same-type-argument-as-field");
const utils_1 = require("../utils/utils");
const constants_1 = require("../../../../constants");
const document_validation_error_1 = require("../utils/document-validation-error");
function verifyCoalesce(enums) {
    return function ({ directiveNode, traversedDef, }) {
        if (traversedDef.kind !== graphql_1.Kind.FIELD_DEFINITION) {
            // delegate
            return;
        }
        const coalesceArg = directiveNode.arguments?.find((a) => a.name.value === "value");
        const expectedType = (0, utils_1.getInnerTypeName)(traversedDef.type);
        if (!coalesceArg) {
            // delegate to DirectiveArgumentOfCorrectType rule
            return;
        }
        if (!(0, utils_1.isArrayType)(traversedDef)) {
            if ((0, constants_1.isSpatial)(expectedType)) {
                throw new document_validation_error_1.DocumentValidationError(`@coalesce is not supported by Spatial types.`, ["value"]);
            }
            if ((0, constants_1.isTemporal)(expectedType)) {
                throw new document_validation_error_1.DocumentValidationError(`@coalesce is not supported by Temporal types.`, ["value"]);
            }
            if (!constants_1.GRAPHQL_BUILTIN_SCALAR_TYPES.includes(expectedType) &&
                !enums.find((x) => x.name.value === expectedType)) {
                throw new document_validation_error_1.DocumentValidationError(`@coalesce directive can only be used on types: Int | Float | String | Boolean | ID | Enum`, []);
            }
        }
        (0, same_type_argument_as_field_1.assertArgumentHasSameTypeAsField)({ directiveName: "@coalesce", traversedDef, argument: coalesceArg, enums });
    };
}
exports.verifyCoalesce = verifyCoalesce;
//# sourceMappingURL=coalesce.js.map