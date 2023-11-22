"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseKeyAnnotation = void 0;
const classes_1 = require("../../../classes");
const KeyAnnotation_1 = require("../../annotation/KeyAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseKeyAnnotation(directives) {
    let isResolvable = false;
    directives.forEach((directive) => {
        // fields is a recognized argument but we don't use it, hence we ignore the non-usage of the variable.
        const { fields, resolvable, ...unrecognizedArguments } = (0, parse_arguments_1.parseArgumentsFromUnknownDirective)(directive);
        if (Object.keys(unrecognizedArguments).length) {
            throw new classes_1.Neo4jGraphQLSchemaValidationError(`@key unrecognized arguments: ${Object.keys(unrecognizedArguments).join(", ")}`);
        }
        isResolvable = isResolvable || resolvable;
    });
    return new KeyAnnotation_1.KeyAnnotation({
        resolvable: isResolvable,
    });
}
exports.parseKeyAnnotation = parseKeyAnnotation;
//# sourceMappingURL=key-annotation.js.map