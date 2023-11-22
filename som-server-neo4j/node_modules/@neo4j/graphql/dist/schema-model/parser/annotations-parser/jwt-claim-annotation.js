"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJWTClaimAnnotation = void 0;
const directives_1 = require("../../../graphql/directives");
const JWTClaimAnnotation_1 = require("../../annotation/JWTClaimAnnotation");
const parse_arguments_1 = require("../parse-arguments");
function parseJWTClaimAnnotation(directive) {
    const { path } = (0, parse_arguments_1.parseArguments)(directives_1.jwtClaim, directive);
    return new JWTClaimAnnotation_1.JWTClaimAnnotation({
        path,
    });
}
exports.parseJWTClaimAnnotation = parseJWTClaimAnnotation;
//# sourceMappingURL=jwt-claim-annotation.js.map