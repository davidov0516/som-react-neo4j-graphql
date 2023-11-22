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
exports.Attribute = void 0;
const Error_1 = require("../../classes/Error");
const Annotation_1 = require("../annotation/Annotation");
class Attribute {
    constructor({ name, annotations = [], type, args, databaseName, description, }) {
        this.annotations = {};
        this.name = name;
        this.type = type;
        this.args = args;
        this.databaseName = databaseName ?? name;
        this.description = description;
        for (const annotation of annotations) {
            this.addAnnotation(annotation);
        }
    }
    clone() {
        return new Attribute({
            name: this.name,
            annotations: Object.values(this.annotations),
            type: this.type,
            args: this.args,
            databaseName: this.databaseName,
            description: this.description,
        });
    }
    addAnnotation(annotation) {
        const annotationKey = (0, Annotation_1.annotationToKey)(annotation);
        if (this.annotations[annotationKey]) {
            throw new Error_1.Neo4jGraphQLSchemaValidationError(`Annotation ${annotationKey} already exists in ${this.name}`);
        }
        // We cast to any because we aren't narrowing the Annotation type here.
        // There's no reason to narrow either, since we care more about performance.
        this.annotations[annotationKey] = annotation;
    }
}
exports.Attribute = Attribute;
//# sourceMappingURL=Attribute.js.map