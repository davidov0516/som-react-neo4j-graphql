"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withObjectType = void 0;
const graphql_1 = require("graphql");
const InterfaceEntity_1 = require("../../schema-model/entity/InterfaceEntity");
const to_compose_1 = require("../to-compose");
function withObjectType({ concreteEntityAdapter, userDefinedFieldDirectives, userDefinedObjectDirectives, composer, }) {
    const nodeFields = (0, to_compose_1.attributeAdapterToComposeFields)(concreteEntityAdapter.objectFields, userDefinedFieldDirectives);
    const composeNode = composer.createObjectTC({
        name: concreteEntityAdapter.name,
        fields: nodeFields,
        description: concreteEntityAdapter.description,
        directives: (0, to_compose_1.graphqlDirectivesToCompose)(userDefinedObjectDirectives),
        interfaces: concreteEntityAdapter.compositeEntities
            .filter((e) => e instanceof InterfaceEntity_1.InterfaceEntity)
            .map((e) => e.name),
    });
    // TODO: maybe split this global node logic?
    if (concreteEntityAdapter.isGlobalNode()) {
        composeNode.setField("id", {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
            resolve: (src) => {
                const field = concreteEntityAdapter.globalIdField.name;
                const value = src[field];
                return concreteEntityAdapter.toGlobalId(value.toString());
            },
        });
        composeNode.addInterface("Node");
    }
    return composeNode;
}
exports.withObjectType = withObjectType;
//# sourceMappingURL=object-type.js.map