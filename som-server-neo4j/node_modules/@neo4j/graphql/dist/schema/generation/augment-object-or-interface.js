"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.augmentObjectOrInterfaceTypeWithRelationshipField = void 0;
const QueryOptions_1 = require("../../graphql/input-objects/QueryOptions");
const UnionEntityAdapter_1 = require("../../schema-model/entity/model-adapters/UnionEntityAdapter");
const directed_argument_1 = require("../directed-argument");
const to_compose_1 = require("../to-compose");
function augmentObjectOrInterfaceTypeWithRelationshipField(relationshipAdapter, userDefinedFieldDirectives, subgraph) {
    const fields = {};
    const relationshipField = {
        type: relationshipAdapter.operations.getTargetTypePrettyName(),
        description: relationshipAdapter.description,
        directives: (0, to_compose_1.graphqlDirectivesToCompose)(userDefinedFieldDirectives.get(relationshipAdapter.name) || []),
    };
    let generateRelFieldArgs = true;
    // Subgraph schemas do not support arguments on relationship fields (singular)
    if (subgraph) {
        if (!relationshipAdapter.isList) {
            generateRelFieldArgs = false;
        }
    }
    if (generateRelFieldArgs) {
        // TODO: replace name reference with getType method
        const optionsTypeName = relationshipAdapter.target instanceof UnionEntityAdapter_1.UnionEntityAdapter
            ? QueryOptions_1.QueryOptions
            : relationshipAdapter.target.operations.optionsInputTypeName;
        const whereTypeName = relationshipAdapter.target.operations.whereInputTypeName;
        const nodeFieldsArgs = {
            where: whereTypeName,
            options: optionsTypeName,
        };
        const directedArg = (0, directed_argument_1.getDirectedArgument)(relationshipAdapter);
        if (directedArg) {
            nodeFieldsArgs["directed"] = directedArg;
        }
        relationshipField.args = nodeFieldsArgs;
    }
    if (relationshipAdapter.isReadable()) {
        fields[relationshipAdapter.name] = relationshipField;
    }
    return fields;
}
exports.augmentObjectOrInterfaceTypeWithRelationshipField = augmentObjectOrInterfaceTypeWithRelationshipField;
//# sourceMappingURL=augment-object-or-interface.js.map