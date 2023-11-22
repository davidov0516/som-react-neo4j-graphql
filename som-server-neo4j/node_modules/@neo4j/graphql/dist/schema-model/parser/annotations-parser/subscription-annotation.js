"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSubscriptionAnnotation = void 0;
const directives_1 = require("../../../graphql/directives");
const SubscriptionAnnotation_1 = require("../../annotation/SubscriptionAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseSubscriptionAnnotation(directive) {
    const { events } = (0, parse_arguments_1.parseArguments)(directives_1.subscriptionDirective, directive);
    return new SubscriptionAnnotation_1.SubscriptionAnnotation({
        events: new Set(events),
    });
}
exports.parseSubscriptionAnnotation = parseSubscriptionAnnotation;
//# sourceMappingURL=subscription-annotation.js.map