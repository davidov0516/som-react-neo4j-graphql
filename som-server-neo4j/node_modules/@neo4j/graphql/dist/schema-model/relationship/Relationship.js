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
exports.Relationship = void 0;
const classes_1 = require("../../classes");
const upper_first_1 = require("../../utils/upper-first");
const Annotation_1 = require("../annotation/Annotation");
// "CREATE" | "UPDATE" | "DELETE" | "CONNECT" | "DISCONNECT" | "CONNECT_OR_CREATE";
class Relationship {
    constructor({ name, type, args, attributes = [], source, target, direction, isList, queryDirection, nestedOperations, aggregate, isNullable, description, annotations = [], propertiesTypeName, inheritedFrom, }) {
        this.attributes = new Map();
        this.annotations = {};
        this.type = type;
        this.source = source;
        this.target = target;
        this.name = name;
        this.args = args;
        this.direction = direction;
        this.isList = isList;
        this.queryDirection = queryDirection;
        this.nestedOperations = nestedOperations;
        this.aggregate = aggregate;
        this.isNullable = isNullable;
        this.description = description;
        this.propertiesTypeName = propertiesTypeName;
        this.inheritedFrom = inheritedFrom;
        for (const attribute of attributes) {
            this.addAttribute(attribute);
        }
        for (const annotation of annotations) {
            this.addAnnotation(annotation);
        }
    }
    clone() {
        return new Relationship({
            name: this.name,
            type: this.type,
            args: this.args,
            attributes: Array.from(this.attributes.values()).map((a) => a.clone()),
            source: this.source,
            target: this.target,
            direction: this.direction,
            isList: this.isList,
            queryDirection: this.queryDirection,
            nestedOperations: this.nestedOperations,
            aggregate: this.aggregate,
            isNullable: this.isNullable,
            description: this.description,
            annotations: Object.values(this.annotations),
            propertiesTypeName: this.propertiesTypeName,
            inheritedFrom: this.inheritedFrom,
        });
    }
    addAnnotation(annotation) {
        const annotationKey = (0, Annotation_1.annotationToKey)(annotation);
        if (this.annotations[annotationKey]) {
            throw new classes_1.Neo4jGraphQLSchemaValidationError(`Annotation ${annotationKey} already exists in ${this.name}`);
        }
        // We cast to any because we aren't narrowing the Annotation type here.
        // There's no reason to narrow either, since we care more about performance.
        this.annotations[annotationKey] = annotation;
    }
    addAttribute(attribute) {
        if (this.attributes.has(attribute.name)) {
            throw new classes_1.Neo4jGraphQLSchemaValidationError(`Attribute ${attribute.name} already exists in ${this.name}.`);
        }
        this.attributes.set(attribute.name, attribute);
    }
    findAttribute(name) {
        return this.attributes.get(name);
    }
    // TODO: Remove  connectionFieldTypename and relationshipFieldTypename and delegate to the adapter
    /**Note: Required for now to infer the types without ResolveTree */
    get connectionFieldTypename() {
        return `${this.source.name}${(0, upper_first_1.upperFirst)(this.name)}Connection`;
    }
    /**Note: Required for now to infer the types without ResolveTree */
    get relationshipFieldTypename() {
        return `${this.source.name}${(0, upper_first_1.upperFirst)(this.name)}Relationship`;
    }
}
exports.Relationship = Relationship;
//# sourceMappingURL=Relationship.js.map