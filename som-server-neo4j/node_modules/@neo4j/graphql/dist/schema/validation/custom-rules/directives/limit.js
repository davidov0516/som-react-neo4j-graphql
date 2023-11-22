"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyLimit = void 0;
const document_validation_error_1 = require("../utils/document-validation-error");
const utils_1 = require("../utils/utils");
function verifyLimit({ directiveNode }) {
    const defaultArg = directiveNode.arguments?.find((a) => a.name.value === "default");
    const maxArg = directiveNode.arguments?.find((a) => a.name.value === "max");
    if (!defaultArg && !maxArg) {
        // nothing to check, fields are optional
        return;
    }
    const defaultLimit = (0, utils_1.parseArgumentToInt)(defaultArg);
    const maxLimit = (0, utils_1.parseArgumentToInt)(maxArg);
    if (defaultLimit) {
        const defaultValue = defaultLimit.toNumber();
        // default must be greater than 0
        if (defaultValue <= 0) {
            throw new document_validation_error_1.DocumentValidationError(`@limit.default invalid value: ${defaultValue}. Must be greater than 0.`, ["default"]);
        }
    }
    if (maxLimit) {
        const maxValue = maxLimit.toNumber();
        // max must be greater than 0
        if (maxValue <= 0) {
            throw new document_validation_error_1.DocumentValidationError(`@limit.max invalid value: ${maxValue}. Must be greater than 0.`, [
                "max",
            ]);
        }
    }
    if (defaultLimit && maxLimit) {
        const defaultValue = defaultLimit.toNumber();
        const maxValue = maxLimit.toNumber();
        // default must be smaller than max
        if (maxLimit < defaultLimit) {
            throw new document_validation_error_1.DocumentValidationError(`@limit.max invalid value: ${maxValue}. Must be greater than limit.default: ${defaultValue}.`, ["max"]);
        }
    }
}
exports.verifyLimit = verifyLimit;
//# sourceMappingURL=limit.js.map