"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAuthorizationAnnotation = void 0;
const AuthorizationAnnotation_1 = require("../../annotation/AuthorizationAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseAuthorizationAnnotation(directive) {
    const { filter, validate } = (0, parse_arguments_1.parseArgumentsFromUnknownDirective)(directive);
    const filterRules = filter?.map((rule) => new AuthorizationAnnotation_1.AuthorizationFilterRule(rule));
    const validateRules = validate?.map((rule) => new AuthorizationAnnotation_1.AuthorizationValidateRule(rule));
    return new AuthorizationAnnotation_1.AuthorizationAnnotation({
        filter: filterRules,
        validate: validateRules,
    });
}
exports.parseAuthorizationAnnotation = parseAuthorizationAnnotation;
//# sourceMappingURL=authorization-annotation.js.map