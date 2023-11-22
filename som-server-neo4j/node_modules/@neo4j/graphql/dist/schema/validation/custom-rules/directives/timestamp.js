"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTimestamp = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("../utils/utils");
const document_validation_error_1 = require("../utils/document-validation-error");
function verifyTimestamp({ traversedDef, }) {
    if (traversedDef.kind !== graphql_1.Kind.FIELD_DEFINITION) {
        // delegate
        return;
    }
    if (traversedDef.type.kind === graphql_1.Kind.LIST_TYPE) {
        throw new document_validation_error_1.DocumentValidationError("Cannot autogenerate an array.", ["@timestamp"]);
    }
    if (!["DateTime", "Time"].includes((0, utils_1.getInnerTypeName)(traversedDef.type))) {
        throw new document_validation_error_1.DocumentValidationError("Cannot timestamp Temporal fields lacking time zone information.", [
            "@timestamp",
        ]);
    }
}
exports.verifyTimestamp = verifyTimestamp;
//# sourceMappingURL=timestamp.js.map