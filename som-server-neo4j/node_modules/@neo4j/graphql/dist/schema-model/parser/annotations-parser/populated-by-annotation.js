"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePopulatedByAnnotation = void 0;
const directives_1 = require("../../../graphql/directives");
const PopulatedByAnnotation_1 = require("../../annotation/PopulatedByAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parsePopulatedByAnnotation(directive) {
    const { callback, operations } = (0, parse_arguments_1.parseArguments)(directives_1.populatedByDirective, directive);
    return new PopulatedByAnnotation_1.PopulatedByAnnotation({
        callback,
        operations,
    });
}
exports.parsePopulatedByAnnotation = parsePopulatedByAnnotation;
//# sourceMappingURL=populated-by-annotation.js.map