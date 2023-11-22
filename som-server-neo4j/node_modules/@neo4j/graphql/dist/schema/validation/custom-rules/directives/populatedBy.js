"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPopulatedBy = void 0;
const parse_value_node_1 = require("../../../../schema-model/parser/parse-value-node");
const document_validation_error_1 = require("../utils/document-validation-error");
function verifyPopulatedBy(callbacks) {
    return function ({ directiveNode }) {
        const callbackArg = directiveNode.arguments?.find((x) => x.name.value === "callback");
        if (!callbackArg) {
            // delegate to DirectiveArgumentOfCorrectType rule
            return;
        }
        const callbackName = (0, parse_value_node_1.parseValueNode)(callbackArg.value);
        if (!callbacks) {
            throw new document_validation_error_1.DocumentValidationError(`@populatedBy.callback needs to be provided in features option.`, [
                "callback",
            ]);
        }
        if (typeof (callbacks || {})[callbackName] !== "function") {
            throw new document_validation_error_1.DocumentValidationError(`@populatedBy.callback \`${callbackName}\` must be of type Function.`, [
                "callback",
            ]);
        }
    };
}
exports.verifyPopulatedBy = verifyPopulatedBy;
//# sourceMappingURL=populatedBy.js.map