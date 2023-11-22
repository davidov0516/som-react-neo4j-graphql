"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMutationAnnotation = void 0;
const classes_1 = require("../../../classes");
const MutationAnnotation_1 = require("../../annotation/MutationAnnotation");
const directives_1 = require("../../../graphql/directives");
const parse_arguments_1 = require("../parse-arguments");
function parseMutationAnnotation(directive) {
    const { operations } = (0, parse_arguments_1.parseArguments)(directives_1.mutationDirective, directive);
    if (!Array.isArray(operations)) {
        throw new classes_1.Neo4jGraphQLSchemaValidationError("@mutation operations must be an array");
    }
    return new MutationAnnotation_1.MutationAnnotation({
        operations: new Set(operations),
    });
}
exports.parseMutationAnnotation = parseMutationAnnotation;
//# sourceMappingURL=mutation-annotation.js.map