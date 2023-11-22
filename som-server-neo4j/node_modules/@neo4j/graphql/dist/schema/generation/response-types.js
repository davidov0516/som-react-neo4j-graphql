"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withMutationResponseTypes = void 0;
const graphql_1 = require("graphql");
const CreateInfo_1 = require("../../graphql/objects/CreateInfo");
const UpdateInfo_1 = require("../../graphql/objects/UpdateInfo");
const to_compose_1 = require("../to-compose");
function withMutationResponseTypes({ concreteEntityAdapter, propagatedDirectives, composer, }) {
    composer.createObjectTC({
        name: concreteEntityAdapter.operations.mutationResponseTypeNames.create,
        fields: {
            info: new graphql_1.GraphQLNonNull(CreateInfo_1.CreateInfo),
            [concreteEntityAdapter.plural]: `[${concreteEntityAdapter.name}!]!`,
        },
        directives: (0, to_compose_1.graphqlDirectivesToCompose)(propagatedDirectives),
    });
    composer.createObjectTC({
        name: concreteEntityAdapter.operations.mutationResponseTypeNames.update,
        fields: {
            info: new graphql_1.GraphQLNonNull(UpdateInfo_1.UpdateInfo),
            [concreteEntityAdapter.plural]: `[${concreteEntityAdapter.name}!]!`,
        },
        directives: (0, to_compose_1.graphqlDirectivesToCompose)(propagatedDirectives),
    });
}
exports.withMutationResponseTypes = withMutationResponseTypes;
//# sourceMappingURL=response-types.js.map