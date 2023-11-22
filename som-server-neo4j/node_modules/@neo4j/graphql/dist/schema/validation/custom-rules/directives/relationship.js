"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRelationshipFieldType = exports.verifyRelationshipArgumentValue = void 0;
const graphql_1 = require("graphql");
const parse_value_node_1 = require("../../../../schema-model/parser/parse-value-node");
const utils_1 = require("../utils/utils");
const document_validation_error_1 = require("../utils/document-validation-error");
const interface_to_implementing_types_1 = require("../utils/interface-to-implementing-types");
function verifyRelationshipArgumentValue(objectTypeToRelationshipsPerRelationshipTypeMap, interfaceToImplementationsMap, extra) {
    return function ({ directiveNode, traversedDef, parentDef, }) {
        if (traversedDef.kind !== graphql_1.Kind.FIELD_DEFINITION) {
            // delegate
            return;
        }
        if (!parentDef) {
            console.error("No parent definition");
            return;
        }
        const typeArg = directiveNode.arguments?.find((a) => a.name.value === "type");
        const directionArg = directiveNode.arguments?.find((a) => a.name.value === "direction");
        const propertiesArg = directiveNode.arguments?.find((a) => a.name.value === "properties");
        if (!typeArg && !directionArg) {
            // delegate to DirectiveArgumentOfCorrectType rule
            return;
        }
        if (typeArg && directionArg) {
            const fieldType = (0, utils_1.getPrettyName)(traversedDef.type);
            const typeValue = (0, parse_value_node_1.parseValueNode)(typeArg.value);
            const directionValue = (0, parse_value_node_1.parseValueNode)(directionArg.value);
            const currentRelationship = [traversedDef.name.value, directionValue, fieldType];
            verifyRelationshipFields(parentDef, currentRelationship, typeValue, objectTypeToRelationshipsPerRelationshipTypeMap, interfaceToImplementationsMap);
        }
        if (propertiesArg) {
            const propertiesValue = (0, parse_value_node_1.parseValueNode)(propertiesArg.value);
            if (!extra) {
                throw new Error("Missing data: Enums, Interfaces, Unions.");
            }
            const relationshipPropertiesInterface = extra.interfaces.filter((i) => i.name.value.toLowerCase() === propertiesValue.toLowerCase() &&
                i.kind !== graphql_1.Kind.INTERFACE_TYPE_EXTENSION);
            if (relationshipPropertiesInterface.length > 1) {
                throw new document_validation_error_1.DocumentValidationError(`@relationship.properties invalid. Cannot have more than 1 interface represent the relationship properties.`, ["properties"]);
            }
            if (!relationshipPropertiesInterface.length) {
                throw new document_validation_error_1.DocumentValidationError(`@relationship.properties invalid. Cannot find interface to represent the relationship properties: ${propertiesValue}.`, ["properties"]);
            }
            const isRelationshipPropertiesInterfaceAnnotated = relationshipPropertiesInterface[0]?.directives?.some((d) => d.name.value === "relationshipProperties");
            if (!isRelationshipPropertiesInterfaceAnnotated) {
                throw new document_validation_error_1.DocumentValidationError(`@relationship.properties invalid. Properties interface ${propertiesValue} must use directive \`@relationshipProperties\`.`, ["properties"]);
            }
        }
    };
}
exports.verifyRelationshipArgumentValue = verifyRelationshipArgumentValue;
function getUpdatedRelationshipFieldsForCurrentType(relationshipFieldsForCurrentType, currentRelationship, typeValue) {
    const updatedRelationshipFieldsForCurrentType = relationshipFieldsForCurrentType || new Map();
    const updatedRelationshipsWithSameRelationshipType = (relationshipFieldsForCurrentType?.get(typeValue) || []).concat([currentRelationship]);
    updatedRelationshipFieldsForCurrentType.set(typeValue, updatedRelationshipsWithSameRelationshipType);
    return updatedRelationshipFieldsForCurrentType;
}
function checkRelationshipFieldsForDuplicates(relationshipFieldsForDependentType, currentRelationship, typeValue) {
    if (!relationshipFieldsForDependentType) {
        return;
    }
    const relationshipsWithSameRelationshipType = relationshipFieldsForDependentType.get(typeValue);
    relationshipsWithSameRelationshipType?.forEach(([fieldName, existingDirection, existingFieldType]) => {
        if (fieldName !== currentRelationship[0] &&
            existingDirection === currentRelationship[1] &&
            existingFieldType === currentRelationship[2]) {
            throw new document_validation_error_1.DocumentValidationError(`@relationship invalid. Multiple fields of the same type cannot have a relationship with the same direction and type combination.`, []);
        }
    });
}
function verifyRelationshipFields(parentDef, currentRelationship, typeValue, objectTypeToRelationshipsPerRelationshipTypeMap, interfaceToImplementationsMap) {
    const relationshipFieldsForCurrentType = objectTypeToRelationshipsPerRelationshipTypeMap.get(parentDef.name.value);
    checkRelationshipFieldsForDuplicates(relationshipFieldsForCurrentType, currentRelationship, typeValue);
    objectTypeToRelationshipsPerRelationshipTypeMap.set(parentDef.name.value, getUpdatedRelationshipFieldsForCurrentType(relationshipFieldsForCurrentType, currentRelationship, typeValue));
    const inheritedTypeNames = (0, interface_to_implementing_types_1.getInheritedTypeNames)(parentDef, interfaceToImplementationsMap);
    inheritedTypeNames.forEach((typeName) => {
        const inheritedRelationshipFields = objectTypeToRelationshipsPerRelationshipTypeMap.get(typeName);
        checkRelationshipFieldsForDuplicates(inheritedRelationshipFields, currentRelationship, typeValue);
    });
    (0, interface_to_implementing_types_1.hydrateInterfaceWithImplementedTypesMap)(parentDef, interfaceToImplementationsMap);
}
function verifyRelationshipFieldType({ traversedDef, }) {
    if (traversedDef.kind !== graphql_1.Kind.FIELD_DEFINITION) {
        // delegate
        return;
    }
    const msg = `Invalid field type: List type relationship fields must be non-nullable and have non-nullable entries, please change type to [${(0, utils_1.getInnerTypeName)(traversedDef.type)}!]!`;
    if (traversedDef.type.kind === graphql_1.Kind.NON_NULL_TYPE) {
        if (traversedDef.type.type.kind === graphql_1.Kind.LIST_TYPE) {
            if (traversedDef.type.type.type.kind !== graphql_1.Kind.NON_NULL_TYPE) {
                throw new document_validation_error_1.DocumentValidationError(msg, []);
            }
        }
    }
    else if (traversedDef.type.kind === graphql_1.Kind.LIST_TYPE) {
        throw new document_validation_error_1.DocumentValidationError(msg, []);
    }
}
exports.verifyRelationshipFieldType = verifyRelationshipFieldType;
//# sourceMappingURL=relationship.js.map