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
exports.Neo4jGraphQLSchemaValidationError = exports.Neo4jGraphQLRelationshipValidationError = exports.Neo4jGraphQLConstraintValidationError = exports.Neo4jGraphQLAuthenticationError = exports.Neo4jGraphQLForbiddenError = exports.Neo4jGraphQLError = void 0;
class Neo4jGraphQLError extends Error {
    constructor(message) {
        super(message);
        // if no name provided, use the default. defineProperty ensures that it stays non-enumerable
        if (!this.name) {
            Object.defineProperty(this, "name", { value: "Neo4jGraphQLError" });
        }
    }
}
exports.Neo4jGraphQLError = Neo4jGraphQLError;
class Neo4jGraphQLForbiddenError extends Neo4jGraphQLError {
    constructor(message) {
        super(message);
        Object.defineProperty(this, "name", { value: "Neo4jGraphQLForbiddenError" });
    }
}
exports.Neo4jGraphQLForbiddenError = Neo4jGraphQLForbiddenError;
class Neo4jGraphQLAuthenticationError extends Neo4jGraphQLError {
    constructor(message) {
        super(message);
        Object.defineProperty(this, "name", { value: "Neo4jGraphQLAuthenticationError" });
    }
}
exports.Neo4jGraphQLAuthenticationError = Neo4jGraphQLAuthenticationError;
class Neo4jGraphQLConstraintValidationError extends Neo4jGraphQLError {
    constructor(message) {
        super(message);
        Object.defineProperty(this, "name", { value: "Neo4jGraphQLConstraintValidationError" });
    }
}
exports.Neo4jGraphQLConstraintValidationError = Neo4jGraphQLConstraintValidationError;
class Neo4jGraphQLRelationshipValidationError extends Neo4jGraphQLError {
    constructor(message) {
        super(message);
        Object.defineProperty(this, "name", { value: "Neo4jGraphQLRelationshipValidationError" });
    }
}
exports.Neo4jGraphQLRelationshipValidationError = Neo4jGraphQLRelationshipValidationError;
class Neo4jGraphQLSchemaValidationError extends Neo4jGraphQLError {
    constructor(message) {
        super(message);
        Object.defineProperty(this, "name", { value: "Neo4jGraphQLSchemaValidationError" });
    }
}
exports.Neo4jGraphQLSchemaValidationError = Neo4jGraphQLSchemaValidationError;
//# sourceMappingURL=Error.js.map