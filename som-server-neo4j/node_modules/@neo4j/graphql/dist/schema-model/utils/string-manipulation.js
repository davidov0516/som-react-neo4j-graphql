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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plural = exports.singular = void 0;
const camelcase_1 = __importDefault(require("camelcase"));
const pluralize_1 = __importDefault(require("pluralize"));
const leading_underscore_1 = require("../../utils/leading-underscore");
function singular(name) {
    const singular = (0, camelcase_1.default)(name);
    return `${(0, leading_underscore_1.leadingUnderscores)(name)}${singular}`;
}
exports.singular = singular;
function plural(name) {
    const plural = (0, pluralize_1.default)((0, camelcase_1.default)(name));
    return `${(0, leading_underscore_1.leadingUnderscores)(name)}${plural}`;
}
exports.plural = plural;
//# sourceMappingURL=string-manipulation.js.map