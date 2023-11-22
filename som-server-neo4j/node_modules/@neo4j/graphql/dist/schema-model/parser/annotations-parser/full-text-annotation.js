"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFullTextAnnotation = void 0;
const directives_1 = require("../../../graphql/directives");
const FullTextAnnotation_1 = require("../../annotation/FullTextAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseFullTextAnnotation(directive) {
    const { indexes } = (0, parse_arguments_1.parseArguments)(directives_1.fulltextDirective, directive);
    return new FullTextAnnotation_1.FullTextAnnotation({
        indexes,
    });
}
exports.parseFullTextAnnotation = parseFullTextAnnotation;
//# sourceMappingURL=full-text-annotation.js.map