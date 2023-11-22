"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCypherAnnotation = void 0;
const classes_1 = require("../../../classes");
const CypherAnnotation_1 = require("../../annotation/CypherAnnotation");
const parse_arguments_1 = require("../parse-arguments");
const directives_1 = require("../../../graphql/directives");
function parseCypherAnnotation(directive) {
    const { statement, columnName } = (0, parse_arguments_1.parseArguments)(directives_1.cypherDirective, directive);
    if (!statement || typeof statement !== "string") {
        throw new classes_1.Neo4jGraphQLSchemaValidationError("@cypher statement required");
    }
    if (!columnName || typeof columnName !== "string") {
        throw new classes_1.Neo4jGraphQLSchemaValidationError("@cypher columnName required");
    }
    return new CypherAnnotation_1.CypherAnnotation({
        statement: statement,
        columnName: columnName,
    });
}
exports.parseCypherAnnotation = parseCypherAnnotation;
//# sourceMappingURL=cypher-annotation.js.map