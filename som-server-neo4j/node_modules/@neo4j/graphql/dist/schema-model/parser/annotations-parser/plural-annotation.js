"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePluralAnnotation = void 0;
const directives_1 = require("../../../graphql/directives");
const PluralAnnotation_1 = require("../../annotation/PluralAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parsePluralAnnotation(directive) {
    const { value } = (0, parse_arguments_1.parseArguments)(directives_1.pluralDirective, directive);
    return new PluralAnnotation_1.PluralAnnotation({
        value,
    });
}
exports.parsePluralAnnotation = parsePluralAnnotation;
//# sourceMappingURL=plural-annotation.js.map