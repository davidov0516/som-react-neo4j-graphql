"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyId = void 0;
const graphql_1 = require("graphql");
const parse_value_node_1 = require("../../../../schema-model/parser/parse-value-node");
const utils_1 = require("../utils/utils");
const document_validation_error_1 = require("../utils/document-validation-error");
function verifyId({ directiveNode, traversedDef, }) {
    if (traversedDef.kind !== graphql_1.Kind.FIELD_DEFINITION) {
        // delegate
        return;
    }
    const autogenerateArg = directiveNode.arguments?.find((x) => x.name.value === "autogenerate");
    if (autogenerateArg) {
        const autogenerate = (0, parse_value_node_1.parseValueNode)(autogenerateArg.value);
        if (!autogenerate) {
            return;
        }
    }
    if (traversedDef.type.kind === graphql_1.Kind.LIST_TYPE) {
        throw new document_validation_error_1.DocumentValidationError("Cannot autogenerate an array.", ["@id"]);
    }
    if ((0, utils_1.getInnerTypeName)(traversedDef.type) !== "ID") {
        throw new document_validation_error_1.DocumentValidationError("Cannot autogenerate a non ID field.", ["@id"]);
    }
}
exports.verifyId = verifyId;
//# sourceMappingURL=id.js.map