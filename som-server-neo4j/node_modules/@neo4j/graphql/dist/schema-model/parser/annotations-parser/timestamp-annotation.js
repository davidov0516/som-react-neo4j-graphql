"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimestampAnnotation = void 0;
const directives_1 = require("../../../graphql/directives");
const TimestampAnnotation_1 = require("../../annotation/TimestampAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseTimestampAnnotation(directive) {
    const { operations } = (0, parse_arguments_1.parseArguments)(directives_1.timestampDirective, directive);
    return new TimestampAnnotation_1.TimestampAnnotation({
        operations,
    });
}
exports.parseTimestampAnnotation = parseTimestampAnnotation;
//# sourceMappingURL=timestamp-annotation.js.map