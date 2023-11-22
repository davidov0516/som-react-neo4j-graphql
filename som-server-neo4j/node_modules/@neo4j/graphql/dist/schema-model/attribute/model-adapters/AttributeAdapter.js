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
exports.AttributeAdapter = void 0;
const AttributeType_1 = require("../AttributeType");
const AttributeTypeHelper_1 = require("../AttributeTypeHelper");
const AggregationAdapter_1 = require("./AggregationAdapter");
const ListAdapter_1 = require("./ListAdapter");
const MathAdapter_1 = require("./MathAdapter");
class AttributeAdapter {
    constructor(attribute) {
        this.name = attribute.name;
        this.type = attribute.type;
        this.args = attribute.args;
        this.annotations = attribute.annotations;
        this.databaseName = attribute.databaseName;
        this.description = attribute.description;
        this.typeHelper = new AttributeTypeHelper_1.AttributeTypeHelper(attribute.type);
    }
    get listModel() {
        if (!this._listModel) {
            if (!this.isArrayMethodField()) {
                return;
            }
            this._listModel = new ListAdapter_1.ListAdapter(this);
        }
        return this._listModel;
    }
    get mathModel() {
        if (!this._mathModel) {
            if (!this.typeHelper.isNumeric() || this.typeHelper.isList()) {
                return;
            }
            this._mathModel = new MathAdapter_1.MathAdapter(this);
        }
        return this._mathModel;
    }
    get aggregationModel() {
        if (!this._aggregationModel) {
            this._aggregationModel = new AggregationAdapter_1.AggregationAdapter(this);
        }
        return this._aggregationModel;
    }
    /**
     * Categories Filters
     * each Attribute has the knowledge of whether it is part of a category
     *
     */
    isMutable() {
        return ((this.typeHelper.isEnum() ||
            this.typeHelper.isAbstract() ||
            this.typeHelper.isSpatial() ||
            this.typeHelper.isScalar() ||
            this.typeHelper.isObject()) &&
            !this.isCypher());
    }
    isUnique() {
        return !!this.annotations.unique || this.isGlobalIDAttribute() === true;
    }
    isCypher() {
        return !!this.annotations.cypher;
    }
    isConstrainable() {
        return (this.typeHelper.isGraphQLBuiltInScalar() ||
            this.typeHelper.isUserScalar() ||
            this.typeHelper.isEnum() ||
            this.typeHelper.isTemporal() ||
            this.typeHelper.isSpatial());
    }
    isObjectField() {
        return (this.typeHelper.isScalar() ||
            this.typeHelper.isEnum() ||
            this.typeHelper.isAbstract() ||
            this.typeHelper.isObject() ||
            this.typeHelper.isSpatial());
    }
    isSortableField() {
        return (!this.typeHelper.isList() &&
            !this.isCustomResolvable() &&
            (this.typeHelper.isScalar() || this.typeHelper.isEnum() || this.typeHelper.isSpatial() || this.isCypher()));
    }
    isWhereField() {
        return ((this.typeHelper.isEnum() || this.typeHelper.isSpatial() || this.typeHelper.isScalar()) &&
            this.isFilterable() &&
            !this.isCustomResolvable() &&
            !this.isCypher());
    }
    isEventPayloadField() {
        return this.typeHelper.isEnum() || this.typeHelper.isSpatial() || this.typeHelper.isScalar();
    }
    isSubscriptionWhereField() {
        return ((this.typeHelper.isEnum() || this.typeHelper.isSpatial() || this.typeHelper.isScalar()) && !this.isCypher());
    }
    isSubscriptionConnectedRelationshipField() {
        return ((this.typeHelper.isEnum() || this.typeHelper.isSpatial() || this.typeHelper.isScalar()) && !this.isCypher());
    }
    isOnCreateField() {
        return (this.isNonGeneratedField() &&
            (this.typeHelper.isScalar() ||
                this.typeHelper.isSpatial() ||
                this.typeHelper.isEnum() ||
                this.typeHelper.isAbstract()));
    }
    isNumericalOrTemporal() {
        return (this.typeHelper.isFloat() ||
            this.typeHelper.isInt() ||
            this.typeHelper.isBigInt() ||
            this.typeHelper.isTemporal());
    }
    isAggregableField() {
        return (!this.typeHelper.isList() && (this.typeHelper.isScalar() || this.typeHelper.isEnum()) && this.isAggregable());
    }
    isAggregationWhereField() {
        const isGraphQLBuiltInScalarWithoutBoolean = this.typeHelper.isGraphQLBuiltInScalar() && !this.typeHelper.isBoolean();
        const isTemporalWithoutDate = this.typeHelper.isTemporal() && !this.typeHelper.isDate();
        return (!this.typeHelper.isList() &&
            (isGraphQLBuiltInScalarWithoutBoolean || isTemporalWithoutDate || this.typeHelper.isBigInt()) &&
            this.isAggregationFilterable());
    }
    isCreateInputField() {
        return this.isNonGeneratedField() && this.annotations.settable?.onCreate !== false;
    }
    isNonGeneratedField() {
        return (this.isCypher() === false &&
            this.isCustomResolvable() === false &&
            (this.typeHelper.isEnum() || this.typeHelper.isScalar() || this.typeHelper.isSpatial()) &&
            !this.annotations.id &&
            !this.annotations.populatedBy &&
            !this.annotations.timestamp);
    }
    isUpdateInputField() {
        return this.isNonGeneratedField() && this.annotations.settable?.onUpdate !== false;
    }
    isArrayMethodField() {
        return (this.typeHelper.isList() &&
            !this.typeHelper.isUserScalar() &&
            (this.typeHelper.isScalar() || this.typeHelper.isSpatial()));
    }
    /**
     * Category Helpers
     *
     */
    getDefaultValue() {
        return this.annotations.default?.value;
    }
    isReadable() {
        return this.annotations.selectable?.onRead !== false;
    }
    isAggregable() {
        return (this.annotations.selectable?.onAggregate !== false &&
            this.isCustomResolvable() === false &&
            this.isCypher() === false);
    }
    isAggregationFilterable() {
        return (this.annotations.filterable?.byAggregate !== false &&
            this.isCustomResolvable() === false &&
            this.isCypher() === false);
    }
    isFilterable() {
        return this.annotations.filterable?.byValue !== false;
    }
    isCustomResolvable() {
        return !!this.annotations.customResolver;
    }
    isGlobalIDAttribute() {
        return !!this.annotations.relayId;
    }
    /**
     * Type names
     * used to create different types for the Attribute or Entity that contains the Attributes
     */
    getTypePrettyName() {
        if (!this.typeHelper.isList()) {
            return `${this.getTypeName()}${this.typeHelper.isRequired() ? "!" : ""}`;
        }
        const listType = this.type;
        if (listType.ofType instanceof AttributeType_1.ListType) {
            // matrix case
            return `[[${this.getTypeName()}${this.typeHelper.isListElementRequired() ? "!" : ""}]]${this.typeHelper.isRequired() ? "!" : ""}`;
        }
        return `[${this.getTypeName()}${this.typeHelper.isListElementRequired() ? "!" : ""}]${this.typeHelper.isRequired() ? "!" : ""}`;
    }
    getTypeName() {
        if (!this.typeHelper.isList()) {
            return this.type.name;
        }
        const listType = this.type;
        if (listType.ofType instanceof AttributeType_1.ListType) {
            // matrix case
            return listType.ofType.ofType.name;
        }
        return listType.ofType.name;
        // return this.isList() ? this.type.ofType.name : this.type.name;
    }
    getFieldTypeName() {
        if (!this.typeHelper.isList()) {
            return this.getTypeName();
        }
        const listType = this.type;
        if (listType.ofType instanceof AttributeType_1.ListType) {
            // matrix case
            return `[[${this.getTypeName()}]]`;
        }
        return `[${this.getTypeName()}]`;
    }
    getInputTypeName() {
        if (this.typeHelper.isSpatial()) {
            if (this.getTypeName() === "Point") {
                return "PointInput";
            }
            else {
                return "CartesianPointInput";
            }
        }
        return this.getTypeName();
    }
    // TODO: We should probably have this live in a different, more specific adapter
    getFilterableInputTypeName() {
        return `[${this.getInputTypeName()}${this.typeHelper.isRequired() ? "!" : ""}]`;
    }
    getInputTypeNames() {
        const pretty = this.typeHelper.isList()
            ? `[${this.getInputTypeName()}${this.typeHelper.isListElementRequired() ? "!" : ""}]`
            : this.getInputTypeName();
        return {
            where: { type: this.getInputTypeName(), pretty },
            create: {
                type: this.getTypeName(),
                pretty: `${pretty}${this.typeHelper.isRequired() ? "!" : ""}`,
            },
            update: {
                type: this.getTypeName(),
                pretty,
            },
        };
    }
}
exports.AttributeAdapter = AttributeAdapter;
//# sourceMappingURL=AttributeAdapter.js.map