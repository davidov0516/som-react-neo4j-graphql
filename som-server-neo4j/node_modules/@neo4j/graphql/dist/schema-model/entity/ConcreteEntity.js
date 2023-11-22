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
exports.ConcreteEntity = void 0;
const classes_1 = require("../../classes");
const sets_are_equal_1 = require("../../utils/sets-are-equal");
const Annotation_1 = require("../annotation/Annotation");
class ConcreteEntity {
    constructor({ name, description, labels, attributes = [], annotations = [], relationships = [], compositeEntities = [], }) {
        this.attributes = new Map();
        this.relationships = new Map();
        this.annotations = {};
        this.compositeEntities = []; // The composite entities that this entity is a part of
        this.name = name;
        this.description = description;
        this.labels = new Set(labels);
        for (const attribute of attributes) {
            this.addAttribute(attribute);
        }
        for (const annotation of annotations) {
            this.addAnnotation(annotation);
        }
        for (const relationship of relationships) {
            this.addRelationship(relationship);
        }
        for (const entity of compositeEntities) {
            this.addCompositeEntities(entity);
        }
    }
    isConcreteEntity() {
        return true;
    }
    isCompositeEntity() {
        return false;
    }
    matchLabels(labels) {
        return (0, sets_are_equal_1.setsAreEqual)(new Set(labels), this.labels);
    }
    addAttribute(attribute) {
        if (this.attributes.has(attribute.name)) {
            throw new classes_1.Neo4jGraphQLSchemaValidationError(`Attribute ${attribute.name} already exists in ${this.name}`);
        }
        this.attributes.set(attribute.name, attribute);
    }
    addAnnotation(annotation) {
        const annotationKey = (0, Annotation_1.annotationToKey)(annotation);
        const existingAnnotation = this.annotations[annotationKey];
        if (existingAnnotation) {
            throw new classes_1.Neo4jGraphQLSchemaValidationError(`Annotation ${annotationKey} already exists in ${this.name}`);
        }
        // We cast to any because we aren't narrowing the Annotation type here.
        // There's no reason to narrow either, since we care more about performance.
        this.annotations[annotationKey] = annotation;
    }
    addRelationship(relationship) {
        if (this.relationships.has(relationship.name)) {
            throw new classes_1.Neo4jGraphQLSchemaValidationError(`Attribute ${relationship.name} already exists in ${this.name}`);
        }
        this.relationships.set(relationship.name, relationship);
    }
    addCompositeEntities(entity) {
        this.compositeEntities.push(entity);
    }
    findAttribute(name) {
        return this.attributes.get(name);
    }
    findRelationship(name) {
        return this.relationships.get(name);
    }
}
exports.ConcreteEntity = ConcreteEntity;
//# sourceMappingURL=ConcreteEntity.js.map