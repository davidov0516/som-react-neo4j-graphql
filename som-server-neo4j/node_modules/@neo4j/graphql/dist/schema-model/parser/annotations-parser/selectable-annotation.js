"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSelectableAnnotation = void 0;
const directives_1 = require("../../../graphql/directives");
const SelectableAnnotation_1 = require("../../annotation/SelectableAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseSelectableAnnotation(directive) {
    const { onRead, onAggregate } = (0, parse_arguments_1.parseArguments)(directives_1.selectableDirective, directive);
    return new SelectableAnnotation_1.SelectableAnnotation({
        onRead,
        onAggregate,
    });
}
exports.parseSelectableAnnotation = parseSelectableAnnotation;
//# sourceMappingURL=selectable-annotation.js.map