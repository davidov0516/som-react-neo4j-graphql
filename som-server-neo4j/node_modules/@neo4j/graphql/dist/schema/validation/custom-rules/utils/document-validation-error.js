"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraphQLError = exports.assertValid = exports.DocumentValidationError = void 0;
const graphql_1 = require("graphql");
class DocumentValidationError extends Error {
    constructor(message, _path) {
        super(message);
        this.path = _path;
    }
}
exports.DocumentValidationError = DocumentValidationError;
function assertValid(fn) {
    let isValid = true;
    let errorMsg, errorPath;
    try {
        fn();
    }
    catch (error) {
        isValid = false;
        errorMsg = error.message;
        errorPath = error.path || [];
    }
    return { isValid, errorMsg, errorPath };
}
exports.assertValid = assertValid;
function createGraphQLError({ nodes, path, errorMsg, extensions, }) {
    const errorOpts = {
        nodes,
        path,
        source: undefined,
        positions: undefined,
        originalError: undefined,
        extensions,
    };
    // TODO: replace constructor to use errorOpts when dropping support for GraphQL15
    return new graphql_1.GraphQLError(errorMsg || "Error", errorOpts.nodes, errorOpts.source, errorOpts.positions, errorOpts.path, errorOpts.originalError, errorOpts.extensions);
}
exports.createGraphQLError = createGraphQLError;
//# sourceMappingURL=document-validation-error.js.map