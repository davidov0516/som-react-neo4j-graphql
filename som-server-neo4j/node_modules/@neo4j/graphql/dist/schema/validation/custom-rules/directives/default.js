"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyDefault = void 0;
const graphql_1 = require("graphql");
const same_type_argument_as_field_1 = require("../utils/same-type-argument-as-field");
const utils_1 = require("../utils/utils");
const document_validation_error_1 = require("../utils/document-validation-error");
const constants_1 = require("../../../../constants");
// TODO: schema-generation: save enums as map
function verifyDefault(enums) {
    return function ({ directiveNode, traversedDef, }) {
        if (traversedDef.kind !== graphql_1.Kind.FIELD_DEFINITION) {
            // delegate
            return;
        }
        const defaultArg = directiveNode.arguments?.find((a) => a.name.value === "value");
        const expectedType = (0, utils_1.getInnerTypeName)(traversedDef.type);
        if (!defaultArg) {
            // delegate to DirectiveArgumentOfCorrectType rule
            return;
        }
        if (!(0, utils_1.isArrayType)(traversedDef)) {
            if ((0, constants_1.isSpatial)(expectedType)) {
                throw new document_validation_error_1.DocumentValidationError(`@default is not supported by Spatial types.`, ["value"]);
            }
            else if ((0, constants_1.isTemporal)(expectedType)) {
                if (Number.isNaN(Date.parse((defaultArg?.value).value))) {
                    throw new document_validation_error_1.DocumentValidationError(`@default.${defaultArg.name.value} is not a valid ${expectedType}`, ["value"]);
                }
            }
            else if (!constants_1.GRAPHQL_BUILTIN_SCALAR_TYPES.includes(expectedType) &&
                !enums.some((x) => x.name.value === expectedType)) {
                throw new document_validation_error_1.DocumentValidationError(`@default directive can only be used on Temporal types and types: Int | Float | String | Boolean | ID | Enum`, []);
            }
        }
        (0, same_type_argument_as_field_1.assertArgumentHasSameTypeAsField)({ directiveName: "@default", traversedDef, argument: defaultArg, enums });
    };
}
exports.verifyDefault = verifyDefault;
//# sourceMappingURL=default.js.map