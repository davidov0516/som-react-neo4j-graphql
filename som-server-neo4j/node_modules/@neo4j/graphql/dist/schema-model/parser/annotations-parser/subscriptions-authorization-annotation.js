"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSubscriptionsAuthorizationAnnotation = void 0;
const parse_arguments_1 = require("../parse-arguments");
const SubscriptionsAuthorizationAnnotation_1 = require("../../annotation/SubscriptionsAuthorizationAnnotation");
function parseSubscriptionsAuthorizationAnnotation(directive) {
    const { filter } = (0, parse_arguments_1.parseArgumentsFromUnknownDirective)(directive);
    const filterRules = filter?.map((rule) => new SubscriptionsAuthorizationAnnotation_1.SubscriptionsAuthorizationFilterRule(rule));
    return new SubscriptionsAuthorizationAnnotation_1.SubscriptionsAuthorizationAnnotation({
        filter: filterRules,
    });
}
exports.parseSubscriptionsAuthorizationAnnotation = parseSubscriptionsAuthorizationAnnotation;
//# sourceMappingURL=subscriptions-authorization-annotation.js.map