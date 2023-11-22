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
exports.Neo4jGraphQLSchemaModel = void 0;
const classes_1 = require("../classes");
const Annotation_1 = require("./annotation/Annotation");
const ConcreteEntityAdapter_1 = require("./entity/model-adapters/ConcreteEntityAdapter");
/** Represents the internal model for the Neo4jGraphQL schema */
class Neo4jGraphQLSchemaModel {
    constructor({ concreteEntities, compositeEntities, operations, annotations, }) {
        this.annotations = {};
        this.entities = [...compositeEntities, ...concreteEntities].reduce((acc, entity) => {
            acc.set(entity.name, entity);
            return acc;
        }, new Map());
        this.concreteEntities = concreteEntities;
        this.compositeEntities = compositeEntities;
        this.operations = operations;
        for (const annotation of annotations) {
            this.addAnnotation(annotation);
        }
    }
    getEntity(name) {
        return this.entities.get(name);
    }
    getConcreteEntityAdapter(name) {
        const concreteEntity = this.concreteEntities.find((entity) => entity.name === name);
        return concreteEntity ? new ConcreteEntityAdapter_1.ConcreteEntityAdapter(concreteEntity) : undefined;
    }
    getEntitiesByLabels(labels) {
        return this.concreteEntities.filter((entity) => entity.matchLabels(labels));
    }
    getEntitiesByNameAndLabels(name, labels) {
        return this.concreteEntities.filter((entity) => entity.name === name && entity.matchLabels(labels));
    }
    addAnnotation(annotation) {
        const annotationKey = (0, Annotation_1.annotationToKey)(annotation);
        const existingAnnotation = this.annotations[annotationKey];
        if (existingAnnotation) {
            throw new classes_1.Neo4jGraphQLSchemaValidationError(`Annotation ${annotationKey} already exists on the schema`);
        }
        // We cast to any because we aren't narrowing the Annotation type here.
        this.annotations[annotationKey] = annotation;
    }
}
exports.Neo4jGraphQLSchemaModel = Neo4jGraphQLSchemaModel;
//# sourceMappingURL=Neo4jGraphQLSchemaModel.js.map