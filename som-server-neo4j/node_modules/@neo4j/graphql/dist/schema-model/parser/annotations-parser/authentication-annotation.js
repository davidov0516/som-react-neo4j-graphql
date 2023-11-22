"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAuthenticationAnnotation = void 0;
const AuthenticationAnnotation_1 = require("../../annotation/AuthenticationAnnotation");
const parse_arguments_1 = require("../parse-arguments");
const authenticationDefaultOperations = [
    "READ",
    "AGGREGATE",
    "CREATE",
    "UPDATE",
    "DELETE",
    "CREATE_RELATIONSHIP",
    "DELETE_RELATIONSHIP",
    "SUBSCRIBE",
];
function parseAuthenticationAnnotation(directive) {
    const args = (0, parse_arguments_1.parseArgumentsFromUnknownDirective)(directive);
    const constructorArgs = [
        args.operations || authenticationDefaultOperations,
    ];
    if (args.jwt) {
        constructorArgs.push(args.jwt);
    }
    return new AuthenticationAnnotation_1.AuthenticationAnnotation(...constructorArgs);
}
exports.parseAuthenticationAnnotation = parseAuthenticationAnnotation;
//# sourceMappingURL=authentication-annotation.js.map