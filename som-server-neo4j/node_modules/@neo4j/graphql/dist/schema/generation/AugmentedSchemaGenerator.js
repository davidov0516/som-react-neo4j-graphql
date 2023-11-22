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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AugmentedSchemaGenerator = void 0;
const graphql_1 = require("graphql");
const graphql_compose_1 = require("graphql-compose");
const SortDirection_1 = require("../../graphql/enums/SortDirection");
const CartesianPointDistance_1 = require("../../graphql/input-objects/CartesianPointDistance");
const CartesianPointInput_1 = require("../../graphql/input-objects/CartesianPointInput");
const FloatWhere_1 = require("../../graphql/input-objects/FloatWhere");
const PointDistance_1 = require("../../graphql/input-objects/PointDistance");
const PointInput_1 = require("../../graphql/input-objects/PointInput");
const QueryOptions_1 = require("../../graphql/input-objects/QueryOptions");
const CartesianPoint_1 = require("../../graphql/objects/CartesianPoint");
const CreateInfo_1 = require("../../graphql/objects/CreateInfo");
const DeleteInfo_1 = require("../../graphql/objects/DeleteInfo");
const PageInfo_1 = require("../../graphql/objects/PageInfo");
const Point_1 = require("../../graphql/objects/Point");
const UpdateInfo_1 = require("../../graphql/objects/UpdateInfo");
const ConcreteEntity_1 = require("../../schema-model/entity/ConcreteEntity");
const InterfaceEntity_1 = require("../../schema-model/entity/InterfaceEntity");
const ConcreteEntityAdapter_1 = require("../../schema-model/entity/model-adapters/ConcreteEntityAdapter");
const InterfaceEntityAdapter_1 = require("../../schema-model/entity/model-adapters/InterfaceEntityAdapter");
const UnionEntityAdapter_1 = require("../../schema-model/entity/model-adapters/UnionEntityAdapter");
const Scalars = __importStar(require("../../graphql/scalars"));
class AugmentedSchemaGenerator {
    constructor(schemaModel, definitionNodes, rootTypesCustomResolvers) {
        this.schemaModel = schemaModel;
        this.definitionNodes = definitionNodes;
        this.rootTypesCustomResolvers = rootTypesCustomResolvers;
        this.composer = new graphql_compose_1.SchemaComposer();
    }
    /**
     * This function will replace make-augmented-schema in orchestrating the creation of the types for each schemaModel construct
     *
     * @returns graphql-compose composer representing the augmented schema
     */
    generate() {
        let pointInTypeDefs = false;
        let cartesianPointInTypeDefs = false;
        let floatWhereInTypeDefs = false;
        for (const entity of this.schemaModel.entities.values()) {
            const model = entity instanceof ConcreteEntity_1.ConcreteEntity
                ? new ConcreteEntityAdapter_1.ConcreteEntityAdapter(entity)
                : entity instanceof InterfaceEntity_1.InterfaceEntity
                    ? new InterfaceEntityAdapter_1.InterfaceEntityAdapter(entity)
                    : new UnionEntityAdapter_1.UnionEntityAdapter(entity); // fixme
            // TODO: check if these can be created ad-hoc
            if (model instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter || model instanceof InterfaceEntityAdapter_1.InterfaceEntityAdapter) {
                for (const attribute of model.attributes.values()) {
                    if (attribute.typeHelper.isPoint()) {
                        pointInTypeDefs = true;
                    }
                    if (attribute.typeHelper.isCartesianPoint()) {
                        cartesianPointInTypeDefs = true;
                    }
                }
                if (model.annotations.fulltext) {
                    floatWhereInTypeDefs = true;
                }
                if (model instanceof ConcreteEntityAdapter_1.ConcreteEntityAdapter) {
                    for (const relationship of model.relationships.values()) {
                        for (const attribute of relationship.attributes.values()) {
                            if (attribute.typeHelper.isPoint()) {
                                pointInTypeDefs = true;
                            }
                            if (attribute.typeHelper.isCartesianPoint()) {
                                cartesianPointInTypeDefs = true;
                            }
                        }
                    }
                }
            }
        }
        // this.pipeDefs();
        this.addToComposer(this.getStaticTypes());
        this.addToComposer(this.getSpatialTypes(pointInTypeDefs, cartesianPointInTypeDefs));
        this.addToComposer(this.getTemporalTypes(floatWhereInTypeDefs));
        return this.composer;
    }
    pipeDefs() {
        const pipedDefs = [
            ...this.definitionNodes.enumTypes,
            ...this.definitionNodes.scalarTypes,
            ...this.definitionNodes.inputObjectTypes,
            ...this.definitionNodes.unionTypes,
            ...this.definitionNodes.directives,
            ...this.rootTypesCustomResolvers,
        ].filter(Boolean);
        if (pipedDefs.length) {
            this.composer.addTypeDefs((0, graphql_1.print)({ kind: graphql_1.Kind.DOCUMENT, definitions: pipedDefs }));
        }
    }
    getStaticTypes() {
        return {
            objects: [CreateInfo_1.CreateInfo, DeleteInfo_1.DeleteInfo, UpdateInfo_1.UpdateInfo, PageInfo_1.PageInfo],
            inputs: [QueryOptions_1.QueryOptions],
            enums: [SortDirection_1.SortDirection],
            scalars: Object.values(Scalars),
        };
    }
    getSpatialTypes(pointInTypeDefs, cartesianPointInTypeDefs) {
        const objects = [];
        const inputs = [];
        if (pointInTypeDefs) {
            objects.push(Point_1.Point);
            inputs.push(PointInput_1.PointInput, PointDistance_1.PointDistance);
        }
        if (cartesianPointInTypeDefs) {
            objects.push(CartesianPoint_1.CartesianPoint);
            inputs.push(CartesianPointInput_1.CartesianPointInput, CartesianPointDistance_1.CartesianPointDistance);
        }
        return {
            objects,
            inputs,
        };
    }
    getTemporalTypes(floatWhereInTypeDefs) {
        const inputs = [];
        if (floatWhereInTypeDefs) {
            inputs.push(FloatWhere_1.FloatWhere);
        }
        return {
            inputs,
        };
    }
    addToComposer({ objects = [], inputs = [], enums = [], scalars = [], interfaces = [], }) {
        objects.forEach((x) => this.composer.createObjectTC(x));
        inputs.forEach((x) => this.composer.createInputTC(x));
        enums.forEach((x) => this.composer.createEnumTC(x));
        interfaces.forEach((x) => this.composer.createInterfaceTC(x));
        scalars.forEach((scalar) => this.composer.addTypeDefs(`scalar ${scalar.name}`));
    }
}
exports.AugmentedSchemaGenerator = AugmentedSchemaGenerator;
//# sourceMappingURL=AugmentedSchemaGenerator.js.map