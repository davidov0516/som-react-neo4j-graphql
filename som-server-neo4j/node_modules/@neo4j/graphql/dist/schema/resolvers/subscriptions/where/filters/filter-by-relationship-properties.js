"use strict";
/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterByRelationshipProperties = void 0;
const filter_relationship_key_1 = require("../utils/filter-relationship-key");
const multiple_conditions_aggregation_map_1 = require("../utils/multiple-conditions-aggregation-map");
const parse_filter_property_1 = require("../utils/parse-filter-property");
const filter_by_properties_1 = require("./filter-by-properties");
function filterByRelationshipProperties({ entityAdapter, whereProperties, receivedEvent, }) {
    const receivedEventProperties = receivedEvent.properties;
    const receivedEventRelationshipType = receivedEvent.relationshipName;
    // const relationships = node.relationFields.filter((f) => f.typeUnescaped === receivedEventRelationshipType);
    // TODO: this was f.typeUnescaped
    const relationships = Array.from(entityAdapter.relationships.values()).filter((f) => f.type === receivedEventRelationshipType);
    if (!relationships.length) {
        return false;
    }
    const receivedEventRelationship = relationships[0]; // ONE relationship only possible
    for (const [wherePropertyKey, wherePropertyValue] of Object.entries(whereProperties)) {
        if (Object.keys(multiple_conditions_aggregation_map_1.multipleConditionsAggregationMap).includes(wherePropertyKey)) {
            const comparisonResultsAggregationFn = multiple_conditions_aggregation_map_1.multipleConditionsAggregationMap[wherePropertyKey];
            let comparisonResults;
            if (wherePropertyKey === "NOT") {
                comparisonResults = filterByRelationshipProperties({
                    entityAdapter,
                    whereProperties: wherePropertyValue,
                    receivedEvent,
                });
            }
            else {
                comparisonResults = wherePropertyValue.map((whereCl) => {
                    return filterByRelationshipProperties({
                        entityAdapter,
                        whereProperties: whereCl,
                        receivedEvent,
                    });
                });
            }
            if (!comparisonResultsAggregationFn(comparisonResults)) {
                return false;
            }
        }
        const { fieldName } = (0, parse_filter_property_1.parseFilterProperty)(wherePropertyKey);
        const connectedNodeFieldName = entityAdapter.operations.subscriptionEventPayloadFieldNames.create_relationship;
        if (fieldName === connectedNodeFieldName) {
            const key = receivedEventRelationship.direction === "IN" ? "to" : "from";
            if (!(0, filter_by_properties_1.filterByProperties)({
                attributes: entityAdapter.attributes,
                whereProperties: wherePropertyValue,
                receivedProperties: receivedEventProperties[key],
            })) {
                return false;
            }
        }
        if (fieldName === "createdRelationship" || fieldName === "deletedRelationship") {
            return (0, filter_relationship_key_1.filterRelationshipKey)({
                receivedEventRelationship,
                where: wherePropertyValue,
                receivedEvent,
            });
        }
    }
    return true;
}
exports.filterByRelationshipProperties = filterByRelationshipProperties;
//# sourceMappingURL=filter-by-relationship-properties.js.map