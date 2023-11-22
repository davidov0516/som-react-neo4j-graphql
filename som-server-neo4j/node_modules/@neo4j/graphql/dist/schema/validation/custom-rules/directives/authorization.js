"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthorization = void 0;
const AuthorizationAnnotation_1 = require("../../../../schema-model/annotation/AuthorizationAnnotation");
const document_validation_error_1 = require("../utils/document-validation-error");
function verifyAuthorization() {
    return function ({ directiveNode }) {
        for (const arg of AuthorizationAnnotation_1.AuthorizationAnnotationArguments) {
            if (directiveNode.arguments?.find((a) => a.name.value === arg)) {
                return;
            }
        }
        throw new document_validation_error_1.DocumentValidationError(`@authorization requires at least one of ${AuthorizationAnnotation_1.AuthorizationAnnotationArguments.join(", ")} arguments`, []);
    };
}
exports.verifyAuthorization = verifyAuthorization;
//# sourceMappingURL=authorization.js.map