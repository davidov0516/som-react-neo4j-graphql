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
exports.leadingUnderscores = void 0;
// leadingUnderscores function returns the leading underscores from the beginning of a given string name. If there are no leading underscores, it returns an empty string.
function leadingUnderscores(name) {
    const re = /^(_+).+/;
    const match = re.exec(name);
    return match?.[1] || "";
}
exports.leadingUnderscores = leadingUnderscores;
//# sourceMappingURL=leading-underscore.js.map