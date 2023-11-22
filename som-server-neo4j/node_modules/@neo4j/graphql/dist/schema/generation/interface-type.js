"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withInterfaceType = void 0;
const InterfaceEntityAdapter_1 = require("../../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const to_compose_1 = require("../to-compose");
function withInterfaceType({ entityAdapter, userDefinedFieldDirectives, userDefinedInterfaceDirectives, composer, config = {
    includeRelationships: false,
}, }) {
    // TODO: maybe create interfaceEntity.interfaceFields() method abstraction even if it retrieves all attributes?
    // can also take includeRelationships as argument
    const objectComposeFields = (0, to_compose_1.attributeAdapterToComposeFields)(Array.from(entityAdapter.attributes.values()), userDefinedFieldDirectives);
    let fields = objectComposeFields;
    if (config.includeRelationships && entityAdapter instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter) {
        fields = {
            ...fields,
            ...(0, to_compose_1.relationshipAdapterToComposeFields)(Array.from(entityAdapter.relationships.values()), userDefinedFieldDirectives),
        };
    }
    const interfaceTypeName = entityAdapter instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter
        ? entityAdapter.name
        : entityAdapter.propertiesTypeName; // this is checked one layer above in execution
    const composeInterface = composer.createInterfaceTC({
        name: interfaceTypeName,
        fields: fields,
        directives: (0, to_compose_1.graphqlDirectivesToCompose)(userDefinedInterfaceDirectives),
    });
    return composeInterface;
}
exports.withInterfaceType = withInterfaceType;
//# sourceMappingURL=interface-type.js.map