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
exports.checkEntityAuthentication = exports.checkAuthentication = void 0;
const apply_authentication_1 = require("./utils/apply-authentication");
function checkAuthentication({ context, node, targetOperations, field, }) {
    const concreteEntities = context.schemaModel.getEntitiesByNameAndLabels(node.name, node.getAllLabels());
    if (concreteEntities.length !== 1) {
        throw new Error("Couldn't match entity");
    }
    const entity = concreteEntities[0];
    return checkEntityAuthentication({
        context,
        entity,
        targetOperations,
        field,
    });
}
exports.checkAuthentication = checkAuthentication;
function checkEntityAuthentication({ context, entity, targetOperations, field, }) {
    const schemaLevelAnnotation = context.schemaModel.annotations.authentication;
    if (schemaLevelAnnotation) {
        const requiresAuthentication = targetOperations.some((targetOperation) => schemaLevelAnnotation && schemaLevelAnnotation.operations.has(targetOperation));
        if (requiresAuthentication) {
            (0, apply_authentication_1.applyAuthentication)({ context, annotation: schemaLevelAnnotation });
        }
    }
    const annotation = field
        ? entity.findAttribute(field)?.annotations.authentication
        : entity.annotations.authentication;
    if (annotation) {
        const requiresAuthentication = targetOperations.some((targetOperation) => annotation && annotation.operations.has(targetOperation));
        if (requiresAuthentication) {
            (0, apply_authentication_1.applyAuthentication)({ context, annotation });
        }
    }
}
exports.checkEntityAuthentication = checkEntityAuthentication;
//# sourceMappingURL=check-authentication.js.map