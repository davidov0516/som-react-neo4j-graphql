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
exports.RelationshipOperations = void 0;
const is_interface_entity_1 = require("../../../translate/queryAST/utils/is-interface-entity");
const is_union_entity_1 = require("../../../translate/queryAST/utils/is-union-entity");
const upper_first_1 = require("../../../utils/upper-first");
class RelationshipOperations {
    constructor(relationship) {
        this.relationship = relationship;
    }
    get prefixForTypename() {
        // if relationship field is inherited  by source
        // (part of a implemented Interface, not necessarily annotated as rel)
        // then return this.interface.name
        return this.relationship.inheritedFrom || this.relationship.source.name;
    }
    get fieldInputPrefixForTypename() {
        const isTargetInterface = (0, is_interface_entity_1.isInterfaceEntity)(this.relationship.target);
        if (isTargetInterface) {
            return this.relationship.source.name;
        }
        return this.prefixForTypename;
    }
    /**Note: Required for now to infer the types without ResolveTree */
    get connectionFieldTypename() {
        return `${this.prefixForTypename}${(0, upper_first_1.upperFirst)(this.relationship.name)}Connection`;
    }
    /**Note: Required for now to infer the types without ResolveTree */
    getAggregationFieldTypename(nestedField) {
        const nestedFieldStr = (0, upper_first_1.upperFirst)(nestedField || "");
        const aggregationStr = nestedField ? "Aggregate" : "Aggregation";
        return `${this.relationship.source.name}${this.relationship.target.name}${(0, upper_first_1.upperFirst)(this.relationship.name)}${nestedFieldStr}${aggregationStr}Selection`;
    }
    getTargetTypePrettyName() {
        if (this.relationship.isList) {
            return `[${this.relationship.target.name}!]${this.relationship.isNullable === false ? "!" : ""}`;
        }
        return `${this.relationship.target.name}${this.relationship.isNullable === false ? "!" : ""}`;
    }
    getConnectionUnionWhereInputTypename(concreteEntityAdapter) {
        return `${this.prefixForTypename}${(0, upper_first_1.upperFirst)(this.relationship.name)}${concreteEntityAdapter.name}ConnectionWhere`;
    }
    get connectionSortInputTypename() {
        return `${this.connectionFieldTypename}Sort`;
    }
    get connectionWhereInputTypename() {
        return `${this.connectionFieldTypename}Where`;
    }
    /**Note: Required for now to infer the types without ResolveTree */
    get relationshipFieldTypename() {
        return `${this.prefixForTypename}${(0, upper_first_1.upperFirst)(this.relationship.name)}Relationship`;
    }
    getFieldInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.prefixForTypename}${(0, upper_first_1.upperFirst)(this.relationship.name)}${ifUnionRelationshipTargetEntity?.name || ""}FieldInput`;
    }
    getToUnionFieldInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.relationship.source.name}${(0, upper_first_1.upperFirst)(this.relationship.name)}${ifUnionRelationshipTargetEntity.name}FieldInput`;
    }
    getUpdateFieldInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.fieldInputPrefixForTypename}${(0, upper_first_1.upperFirst)(this.relationship.name)}${ifUnionRelationshipTargetEntity?.name || ""}UpdateFieldInput`;
    }
    getCreateFieldInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.fieldInputPrefixForTypename}${(0, upper_first_1.upperFirst)(this.relationship.name)}${ifUnionRelationshipTargetEntity?.name || ""}CreateFieldInput`;
    }
    getDeleteFieldInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.fieldInputPrefixForTypename}${(0, upper_first_1.upperFirst)(this.relationship.name)}${ifUnionRelationshipTargetEntity?.name || ""}DeleteFieldInput`;
    }
    getConnectFieldInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.fieldInputPrefixForTypename}${(0, upper_first_1.upperFirst)(this.relationship.name)}${ifUnionRelationshipTargetEntity?.name || ""}ConnectFieldInput`;
    }
    getDisconnectFieldInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.fieldInputPrefixForTypename}${(0, upper_first_1.upperFirst)(this.relationship.name)}${ifUnionRelationshipTargetEntity?.name || ""}DisconnectFieldInput`;
    }
    getConnectOrCreateInputTypeName() {
        return `${this.prefixForTypename}${(0, upper_first_1.upperFirst)(this.relationship.name)}ConnectOrCreateInput`;
    }
    getConnectOrCreateFieldInputTypeName(concreteTargetEntityAdapter) {
        if ((0, is_union_entity_1.isUnionEntity)(this.relationship.target)) {
            if (!concreteTargetEntityAdapter) {
                throw new Error("missing concreteTargetEntityAdapter");
            }
            return `${this.prefixForTypename}${(0, upper_first_1.upperFirst)(this.relationship.name)}${concreteTargetEntityAdapter.name}ConnectOrCreateFieldInput`;
        }
        return `${this.prefixForTypename}${(0, upper_first_1.upperFirst)(this.relationship.name)}ConnectOrCreateFieldInput`;
    }
    getConnectOrCreateOnCreateFieldInputTypeName(concreteTargetEntityAdapter) {
        return `${this.getConnectOrCreateFieldInputTypeName(concreteTargetEntityAdapter)}OnCreate`;
    }
    get connectionFieldName() {
        return `${this.relationship.name}Connection`;
    }
    getConnectionWhereTypename(ifUnionRelationshipTargetEntity) {
        return `${this.prefixForTypename}${(0, upper_first_1.upperFirst)(this.relationship.name)}${ifUnionRelationshipTargetEntity?.name || ""}ConnectionWhere`;
    }
    getUpdateConnectionInputTypename(ifUnionRelationshipTargetEntity) {
        return `${this.fieldInputPrefixForTypename}${(0, upper_first_1.upperFirst)(this.relationship.name)}${ifUnionRelationshipTargetEntity?.name || ""}UpdateConnectionInput`;
    }
    get aggregateInputTypeName() {
        return `${this.relationship.source.name}${(0, upper_first_1.upperFirst)(this.relationship.name)}AggregateInput`;
    }
    get aggregateTypeName() {
        return `${this.relationship.name}Aggregate`;
    }
    getAggregationWhereInputTypeName(isA) {
        return `${this.relationship.source.name}${(0, upper_first_1.upperFirst)(this.relationship.name)}${isA}AggregationWhereInput`;
    }
    get subscriptionWhereInputTypeName() {
        return `${this.relationship.source.name}${(0, upper_first_1.upperFirst)(this.relationship.name)}RelationshipSubscriptionWhere`;
    }
    getToUnionSubscriptionWhereInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.relationship.source.name}${(0, upper_first_1.upperFirst)(this.relationship.name)}${ifUnionRelationshipTargetEntity.name}SubscriptionWhere`;
    }
    get unionConnectInputTypeName() {
        return `${(0, upper_first_1.upperFirst)(this.relationship.source.name)}${(0, upper_first_1.upperFirst)(this.relationship.name)}ConnectInput`;
    }
    get unionDeleteInputTypeName() {
        return `${(0, upper_first_1.upperFirst)(this.relationship.source.name)}${(0, upper_first_1.upperFirst)(this.relationship.name)}DeleteInput`;
    }
    get unionDisconnectInputTypeName() {
        return `${(0, upper_first_1.upperFirst)(this.relationship.source.name)}${(0, upper_first_1.upperFirst)(this.relationship.name)}DisconnectInput`;
    }
    get unionCreateInputTypeName() {
        return `${(0, upper_first_1.upperFirst)(this.relationship.source.name)}${(0, upper_first_1.upperFirst)(this.relationship.name)}CreateInput`;
    }
    get unionCreateFieldInputTypeName() {
        return `${(0, upper_first_1.upperFirst)(this.relationship.source.name)}${(0, upper_first_1.upperFirst)(this.relationship.name)}CreateFieldInput`;
    }
    get unionUpdateInputTypeName() {
        return `${(0, upper_first_1.upperFirst)(this.relationship.source.name)}${(0, upper_first_1.upperFirst)(this.relationship.name)}UpdateInput`;
    }
    getToUnionUpdateInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.relationship.source.name}${(0, upper_first_1.upperFirst)(this.relationship.name)}${ifUnionRelationshipTargetEntity.name}UpdateInput`;
    }
    get subscriptionConnectedRelationshipTypeName() {
        return `${this.relationship.source.name}${(0, upper_first_1.upperFirst)(this.relationship.name)}ConnectedRelationship`;
    }
    get edgeCreateInputTypeName() {
        return `${this.relationship.propertiesTypeName}CreateInput${this.relationship.hasNonNullNonGeneratedProperties ? `!` : ""}`;
    }
    get createInputTypeName() {
        return `${this.relationship.propertiesTypeName}CreateInput`;
    }
    get edgeUpdateInputTypeName() {
        return `${this.relationship.propertiesTypeName}UpdateInput`;
    }
    get whereInputTypeName() {
        return `${this.relationship.propertiesTypeName}Where`;
    }
    get edgeSubscriptionWhereInputTypeName() {
        return `${this.relationship.propertiesTypeName}SubscriptionWhere`;
    }
    get sortInputTypeName() {
        return `${this.relationship.propertiesTypeName}Sort`;
    }
    getConnectOrCreateInputFields(target) {
        // TODO: use this._target in the end; currently passed-in as argument because unions need this per refNode
        return {
            where: `${target.operations.connectOrCreateWhereInputTypeName}!`,
            onCreate: `${this.getConnectOrCreateOnCreateFieldInputTypeName(target)}!`,
        };
    }
}
exports.RelationshipOperations = RelationshipOperations;
//# sourceMappingURL=RelationshipOperations.js.map