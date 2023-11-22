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
exports.AuthorizationValidateRule = exports.AuthorizationFilterRule = exports.AuthorizationAnnotation = exports.AuthorizationValidateOperationRule = exports.AuthorizationFilterOperationRule = exports.AuthorizationAnnotationArguments = void 0;
exports.AuthorizationAnnotationArguments = ["filter", "validate"];
exports.AuthorizationFilterOperationRule = [
    "READ",
    "AGGREGATE",
    "UPDATE",
    "DELETE",
    "CREATE_RELATIONSHIP",
    "DELETE_RELATIONSHIP",
];
exports.AuthorizationValidateOperationRule = [
    "READ",
    "AGGREGATE",
    "CREATE",
    "UPDATE",
    "DELETE",
    "CREATE_RELATIONSHIP",
    "DELETE_RELATIONSHIP",
];
class AuthorizationAnnotation {
    constructor({ filter, validate }) {
        this.filter = filter;
        this.validate = validate;
    }
}
exports.AuthorizationAnnotation = AuthorizationAnnotation;
class AuthorizationFilterRule {
    constructor({ operations, requireAuthentication, where }) {
        this.operations = operations ?? [...exports.AuthorizationFilterOperationRule];
        this.requireAuthentication = requireAuthentication === undefined ? true : requireAuthentication;
        this.where = where;
    }
}
exports.AuthorizationFilterRule = AuthorizationFilterRule;
class AuthorizationValidateRule {
    constructor({ operations, requireAuthentication, where, when }) {
        this.operations = operations ?? [...exports.AuthorizationValidateOperationRule];
        this.requireAuthentication = requireAuthentication === undefined ? true : requireAuthentication;
        this.where = where;
        this.when = when ?? ["BEFORE", "AFTER"];
    }
}
exports.AuthorizationValidateRule = AuthorizationValidateRule;
//# sourceMappingURL=AuthorizationAnnotation.js.map