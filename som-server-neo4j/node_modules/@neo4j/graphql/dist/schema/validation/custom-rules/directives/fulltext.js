"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFulltext = void 0;
const graphql_1 = require("graphql");
const parse_value_node_1 = require("../../../../schema-model/parser/parse-value-node");
const document_validation_error_1 = require("../utils/document-validation-error");
function verifyFulltext({ directiveNode, traversedDef, }) {
    if (traversedDef.kind !== graphql_1.Kind.OBJECT_TYPE_DEFINITION && traversedDef.kind !== graphql_1.Kind.OBJECT_TYPE_EXTENSION) {
        // delegate
        return;
    }
    const indexesArg = directiveNode.arguments?.find((a) => a.name.value === "indexes");
    if (!indexesArg) {
        // delegate to DirectiveArgumentOfCorrectType rule
        return;
    }
    const indexesValue = (0, parse_value_node_1.parseValueNode)(indexesArg.value);
    const compatibleFields = traversedDef.fields?.filter((f) => {
        if (f.type.kind === graphql_1.Kind.NON_NULL_TYPE) {
            const innerType = f.type.type;
            if (innerType.kind === graphql_1.Kind.NAMED_TYPE) {
                return ["String", "ID"].includes(innerType.name.value);
            }
        }
        if (f.type.kind === graphql_1.Kind.NAMED_TYPE) {
            return ["String", "ID"].includes(f.type.name.value);
        }
        return false;
    });
    indexesValue.forEach((index) => {
        const indexName = index.indexName || index.name;
        const names = indexesValue.filter((i) => indexName === (i.indexName || i.name));
        if (names.length > 1) {
            throw new document_validation_error_1.DocumentValidationError(`@fulltext.indexes invalid value for: ${indexName}. Duplicate name.`, [
                "indexes",
            ]);
        }
        (index.fields || []).forEach((field) => {
            const foundField = compatibleFields?.some((f) => f.name.value === field);
            if (!foundField) {
                throw new document_validation_error_1.DocumentValidationError(`@fulltext.indexes invalid value for: ${indexName}. Field ${field} is not of type String or ID.`, ["indexes"]);
            }
        });
    });
}
exports.verifyFulltext = verifyFulltext;
//# sourceMappingURL=fulltext.js.map