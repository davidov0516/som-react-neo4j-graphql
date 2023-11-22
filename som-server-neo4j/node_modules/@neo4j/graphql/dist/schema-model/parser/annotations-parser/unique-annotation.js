"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUniqueAnnotation = void 0;
const directives_1 = require("../../../graphql/directives");
const UniqueAnnotation_1 = require("../../annotation/UniqueAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseUniqueAnnotation(directive) {
    const { constraintName } = (0, parse_arguments_1.parseArguments)(directives_1.uniqueDirective, directive);
    return new UniqueAnnotation_1.UniqueAnnotation({
        constraintName,
    });
}
exports.parseUniqueAnnotation = parseUniqueAnnotation;
//# sourceMappingURL=unique-annotation.js.map