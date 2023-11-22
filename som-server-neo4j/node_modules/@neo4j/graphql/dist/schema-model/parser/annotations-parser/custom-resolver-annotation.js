"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCustomResolverAnnotation = void 0;
const directives_1 = require("../../../graphql/directives");
const CustomResolverAnnotation_1 = require("../../annotation/CustomResolverAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseCustomResolverAnnotation(directive) {
    const { requires } = (0, parse_arguments_1.parseArguments)(directives_1.customResolverDirective, directive);
    return new CustomResolverAnnotation_1.CustomResolverAnnotation({
        requires,
    });
}
exports.parseCustomResolverAnnotation = parseCustomResolverAnnotation;
//# sourceMappingURL=custom-resolver-annotation.js.map