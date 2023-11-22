"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrayType = exports.parseArgumentToInt = exports.getPrettyName = exports.fromValueKind = exports.getInnerTypeName = void 0;
const graphql_1 = require("graphql");
const neo4j = __importStar(require("neo4j-driver"));
const parse_value_node_1 = require("../../../../schema-model/parser/parse-value-node");
function getInnerTypeName(typeNode) {
    if (typeNode.kind === graphql_1.Kind.LIST_TYPE) {
        return getInnerTypeName(typeNode.type);
    }
    if (typeNode.kind === graphql_1.Kind.NON_NULL_TYPE) {
        return getInnerTypeName(typeNode.type);
    }
    // Kind.NAMED_TYPE
    return typeNode.name.value;
}
exports.getInnerTypeName = getInnerTypeName;
function fromValueKind(valueNode, enums, expectedType) {
    switch (valueNode.kind) {
        case graphql_1.Kind.STRING:
            return "string";
        case graphql_1.Kind.INT:
            return "int";
        case graphql_1.Kind.FLOAT:
            return "float";
        case graphql_1.Kind.BOOLEAN:
            return "boolean";
        case graphql_1.Kind.ENUM: {
            const enumType = enums?.find((x) => x.name.value === expectedType);
            const enumValue = enumType?.values?.find((value) => value.name.value === valueNode.value);
            if (enumType && enumValue) {
                return enumType.name.value;
            }
            break;
        }
        default:
            // Kind.OBJECT and Kind.VARIABLE remaining
            return;
    }
}
exports.fromValueKind = fromValueKind;
function getPrettyName(typeNode) {
    if (typeNode.kind === graphql_1.Kind.LIST_TYPE) {
        return `[${getPrettyName(typeNode.type)}]`;
    }
    if (typeNode.kind === graphql_1.Kind.NON_NULL_TYPE) {
        return `${getPrettyName(typeNode.type)}!`;
    }
    // Kind.NAMED_TYPE
    return typeNode.name.value;
}
exports.getPrettyName = getPrettyName;
function parseArgumentToInt(arg) {
    if (arg) {
        const parsed = (0, parse_value_node_1.parseValueNode)(arg.value);
        return neo4j.int(parsed);
    }
    return undefined;
}
exports.parseArgumentToInt = parseArgumentToInt;
function isArrayType(traversedDef) {
    return (traversedDef.type.kind === graphql_1.Kind.LIST_TYPE ||
        (traversedDef.type.kind === graphql_1.Kind.NON_NULL_TYPE && traversedDef.type.type.kind === graphql_1.Kind.LIST_TYPE));
}
exports.isArrayType = isArrayType;
//# sourceMappingURL=utils.js.map