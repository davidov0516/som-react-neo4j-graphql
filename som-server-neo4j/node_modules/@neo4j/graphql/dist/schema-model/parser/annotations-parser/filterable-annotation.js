"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFilterableAnnotation = void 0;
const directives_1 = require("../../../graphql/directives");
const FilterableAnnotation_1 = require("../../annotation/FilterableAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseFilterableAnnotation(directive) {
    const { byValue, byAggregate } = (0, parse_arguments_1.parseArguments)(directives_1.filterableDirective, directive);
    return new FilterableAnnotation_1.FilterableAnnotation({
        byAggregate,
        byValue,
    });
}
exports.parseFilterableAnnotation = parseFilterableAnnotation;
//# sourceMappingURL=filterable-annotation.js.map