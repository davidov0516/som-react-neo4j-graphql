"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSettableAnnotation = void 0;
const directives_1 = require("../../../graphql/directives");
const SettableAnnotation_1 = require("../../annotation/SettableAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseSettableAnnotation(directive) {
    const { onCreate, onUpdate } = (0, parse_arguments_1.parseArguments)(directives_1.settableDirective, directive);
    return new SettableAnnotation_1.SettableAnnotation({
        onCreate,
        onUpdate,
    });
}
exports.parseSettableAnnotation = parseSettableAnnotation;
//# sourceMappingURL=settable-annotation.js.map