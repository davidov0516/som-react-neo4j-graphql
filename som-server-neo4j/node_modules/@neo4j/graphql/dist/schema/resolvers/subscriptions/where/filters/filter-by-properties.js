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
exports.filterByProperties = void 0;
const neo4j_driver_1 = require("neo4j-driver");
const get_filtering_fn_1 = require("../utils/get-filtering-fn");
const multiple_conditions_aggregation_map_1 = require("../utils/multiple-conditions-aggregation-map");
const parse_filter_property_1 = require("../utils/parse-filter-property");
/** Returns true if receivedProperties comply with filters specified in whereProperties, false otherwise. */
function filterByProperties({ attributes, whereProperties, receivedProperties, }) {
    for (const [k, v] of Object.entries(whereProperties)) {
        if (Object.keys(multiple_conditions_aggregation_map_1.multipleConditionsAggregationMap).includes(k)) {
            const comparisonResultsAggregationFn = multiple_conditions_aggregation_map_1.multipleConditionsAggregationMap[k];
            let comparisonResults;
            if (k === "NOT") {
                comparisonResults = filterByProperties({
                    attributes,
                    whereProperties: v,
                    receivedProperties,
                });
            }
            else {
                comparisonResults = v.map((whereCl) => {
                    return filterByProperties({ attributes, whereProperties: whereCl, receivedProperties });
                });
            }
            if (!comparisonResultsAggregationFn(comparisonResults)) {
                return false;
            }
        }
        else {
            const { fieldName, operator } = (0, parse_filter_property_1.parseFilterProperty)(k);
            const receivedValue = receivedProperties[fieldName];
            if (!receivedValue) {
                return false;
            }
            const fieldMeta = attributes.get(fieldName);
            const checkFilterPasses = (0, get_filtering_fn_1.getFilteringFn)(operator, operatorMapOverrides);
            if (!checkFilterPasses(receivedValue, v, fieldMeta)) {
                return false;
            }
        }
    }
    return true;
}
exports.filterByProperties = filterByProperties;
const isFloatOrStringOrIDAsString = (attributeAdapter, value) => attributeAdapter?.typeHelper.isFloat() ||
    attributeAdapter?.typeHelper.isString() ||
    (attributeAdapter?.typeHelper.isID() && (0, neo4j_driver_1.int)(value).toString() !== value);
const operatorMapOverrides = {
    INCLUDES: (received, filtered, fieldMeta) => {
        if (isFloatOrStringOrIDAsString(fieldMeta, filtered)) {
            return received.some((v) => v === filtered);
        }
        // int/ bigint
        const filteredAsNeo4jInteger = (0, neo4j_driver_1.int)(filtered);
        return received.some((r) => (0, neo4j_driver_1.int)(r).equals(filteredAsNeo4jInteger));
    },
    NOT_INCLUDES: (received, filtered, fieldMeta) => {
        if (isFloatOrStringOrIDAsString(fieldMeta, filtered)) {
            return !received.some((v) => v === filtered);
        }
        // int/ bigint
        const filteredAsNeo4jInteger = (0, neo4j_driver_1.int)(filtered);
        return !received.some((r) => (0, neo4j_driver_1.int)(r).equals(filteredAsNeo4jInteger));
    },
    IN: (received, filtered, fieldMeta) => {
        if (isFloatOrStringOrIDAsString(fieldMeta, received)) {
            return filtered.some((v) => v === received);
        }
        // int/ bigint
        const receivedAsNeo4jInteger = (0, neo4j_driver_1.int)(received);
        return filtered.some((r) => (0, neo4j_driver_1.int)(r).equals(receivedAsNeo4jInteger));
    },
    NOT_IN: (received, filtered, fieldMeta) => {
        if (isFloatOrStringOrIDAsString(fieldMeta, received)) {
            return !filtered.some((v) => v === received);
        }
        // int/ bigint
        const receivedAsNeo4jInteger = (0, neo4j_driver_1.int)(received);
        return !filtered.some((r) => (0, neo4j_driver_1.int)(r).equals(receivedAsNeo4jInteger));
    },
};
//# sourceMappingURL=filter-by-properties.js.map