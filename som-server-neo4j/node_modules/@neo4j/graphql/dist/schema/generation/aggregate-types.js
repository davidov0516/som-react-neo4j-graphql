"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAggregateInputType = exports.withAggregateSelectionType = void 0;
const graphql_1 = require("graphql");
const constants_1 = require("../../constants");
const ConcreteEntityAdapter_1 = require("../../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const constants_2 = require("../constants");
const numerical_1 = require("../resolvers/field/numerical");
const to_compose_1 = require("../to-compose");
function withAggregateSelectionType({ concreteEntityAdapter, aggregationTypesMapper, propagatedDirectives, composer, }) {
    const aggregateSelection = composer.createObjectTC({
        name: concreteEntityAdapter.operations.aggregateTypeNames.selection,
        fields: {
            count: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                resolve: numerical_1.numericalResolver,
                args: {},
            },
        },
        directives: (0, to_compose_1.graphqlDirectivesToCompose)(propagatedDirectives),
    });
    aggregateSelection.addFields(makeAggregableFields({ concreteEntityAdapter, aggregationTypesMapper }));
    return aggregateSelection;
}
exports.withAggregateSelectionType = withAggregateSelectionType;
function makeAggregableFields({ concreteEntityAdapter, aggregationTypesMapper, }) {
    const aggregableFields = {};
    const aggregableAttributes = concreteEntityAdapter.aggregableFields;
    for (const attribute of aggregableAttributes) {
        const objectTypeComposer = aggregationTypesMapper.getAggregationType({
            fieldName: attribute.getTypeName(),
            nullable: !attribute.typeHelper.isRequired(),
        });
        if (objectTypeComposer) {
            aggregableFields[attribute.name] = objectTypeComposer.NonNull;
        }
    }
    return aggregableFields;
}
function withAggregateInputType({ relationshipAdapter, entityAdapter, // TODO: this is relationshipAdapter.target but from the context above it is known to be ConcreteEntity and we don't know this yet!!!
composer, }) {
    const aggregateInputTypeName = relationshipAdapter.operations.aggregateInputTypeName;
    if (composer.has(aggregateInputTypeName)) {
        return composer.getITC(aggregateInputTypeName);
    }
    const aggregateSelection = composer.createInputTC({
        name: aggregateInputTypeName,
        fields: {
            count: graphql_1.GraphQLInt,
            count_LT: graphql_1.GraphQLInt,
            count_LTE: graphql_1.GraphQLInt,
            count_GT: graphql_1.GraphQLInt,
            count_GTE: graphql_1.GraphQLInt,
        },
    });
    aggregateSelection.addFields({
        AND: aggregateSelection.NonNull.List,
        OR: aggregateSelection.NonNull.List,
        NOT: aggregateSelection,
    });
    const nodeWhereInputType = withAggregationWhereInputType({
        relationshipAdapter,
        entityAdapter,
        composer,
    });
    if (nodeWhereInputType) {
        aggregateSelection.addFields({ node: nodeWhereInputType });
    }
    const edgeWhereInputType = withAggregationWhereInputType({
        relationshipAdapter,
        entityAdapter: relationshipAdapter,
        composer,
    });
    if (edgeWhereInputType) {
        aggregateSelection.addFields({ edge: edgeWhereInputType });
    }
    return aggregateSelection;
}
exports.withAggregateInputType = withAggregateInputType;
function withAggregationWhereInputType({ relationshipAdapter, entityAdapter, composer, }) {
    const aggregationFields = entityAdapter.aggregationWhereFields;
    if (!aggregationFields.length) {
        return;
    }
    const aggregationInputName = relationshipAdapter.operations.getAggregationWhereInputTypeName(entityAdapter instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter ? `Node` : `Edge`);
    if (composer.has(aggregationInputName)) {
        return composer.getITC(aggregationInputName);
    }
    const aggregationInput = composer.createInputTC({
        name: aggregationInputName,
        fields: {},
    });
    aggregationInput.addFields({
        AND: aggregationInput.NonNull.List,
        OR: aggregationInput.NonNull.List,
        NOT: aggregationInput,
    });
    aggregationInput.addFields(makeAggregationFields(aggregationFields));
    return aggregationInput;
}
function makeAggregationFields(attributes) {
    const aggregationFields = attributes
        .map((attribute) => getAggregationFieldsByType(attribute))
        .reduce((acc, el) => ({ ...acc, ...el }), {});
    return aggregationFields;
}
// TODO: refactor this by introducing specialized Adapters
function getAggregationFieldsByType(attribute) {
    const fields = {};
    if (attribute.typeHelper.isID()) {
        fields[`${attribute.name}_EQUAL`] = {
            type: graphql_1.GraphQLID,
            directives: [constants_2.DEPRECATE_INVALID_AGGREGATION_FILTERS],
        };
        return fields;
    }
    if (attribute.typeHelper.isString()) {
        for (const operator of constants_1.AGGREGATION_COMPARISON_OPERATORS) {
            fields[`${attribute.name}_${operator}`] = {
                type: `${operator === "EQUAL" ? graphql_1.GraphQLString : graphql_1.GraphQLInt}`,
                directives: [constants_2.DEPRECATE_INVALID_AGGREGATION_FILTERS],
            };
            fields[`${attribute.name}_AVERAGE_${operator}`] = {
                type: graphql_1.GraphQLFloat,
                directives: [constants_2.DEPRECATE_IMPLICIT_LENGTH_AGGREGATION_FILTERS],
            };
            fields[`${attribute.name}_LONGEST_${operator}`] = {
                type: graphql_1.GraphQLInt,
                directives: [constants_2.DEPRECATE_IMPLICIT_LENGTH_AGGREGATION_FILTERS],
            };
            fields[`${attribute.name}_SHORTEST_${operator}`] = {
                type: graphql_1.GraphQLInt,
                directives: [constants_2.DEPRECATE_IMPLICIT_LENGTH_AGGREGATION_FILTERS],
            };
            fields[`${attribute.name}_AVERAGE_LENGTH_${operator}`] = graphql_1.GraphQLFloat;
            fields[`${attribute.name}_LONGEST_LENGTH_${operator}`] = graphql_1.GraphQLInt;
            fields[`${attribute.name}_SHORTEST_LENGTH_${operator}`] = graphql_1.GraphQLInt;
        }
        return fields;
    }
    if (attribute.typeHelper.isNumeric() || attribute.typeHelper.isDuration()) {
        // Types that you can average
        // https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-avg
        // https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-avg-duration
        // String uses avg(size())
        for (const operator of constants_1.AGGREGATION_COMPARISON_OPERATORS) {
            fields[`${attribute.name}_${operator}`] = {
                type: attribute.getTypeName(),
                directives: [constants_2.DEPRECATE_INVALID_AGGREGATION_FILTERS],
            };
            fields[`${attribute.name}_MIN_${operator}`] = attribute.getTypeName();
            fields[`${attribute.name}_MAX_${operator}`] = attribute.getTypeName();
            if (attribute.getTypeName() !== "Duration") {
                fields[`${attribute.name}_SUM_${operator}`] = attribute.getTypeName();
            }
            const averageType = attribute.typeHelper.isBigInt()
                ? "BigInt"
                : attribute.typeHelper.isDuration()
                    ? "Duration"
                    : graphql_1.GraphQLFloat;
            fields[`${attribute.name}_AVERAGE_${operator}`] = averageType;
        }
        return fields;
    }
    for (const operator of constants_1.AGGREGATION_COMPARISON_OPERATORS) {
        fields[`${attribute.name}_${operator}`] = {
            type: attribute.getTypeName(),
            directives: [constants_2.DEPRECATE_INVALID_AGGREGATION_FILTERS],
        };
        fields[`${attribute.name}_MIN_${operator}`] = attribute.getTypeName();
        fields[`${attribute.name}_MAX_${operator}`] = attribute.getTypeName();
    }
    return fields;
}
//# sourceMappingURL=aggregate-types.js.map