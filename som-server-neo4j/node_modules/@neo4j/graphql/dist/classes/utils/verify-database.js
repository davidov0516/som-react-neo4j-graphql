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
const verify_functions_1 = require("./verify-functions");
const verify_version_1 = require("./verify-version");
async function checkNeo4jCompat({ driver, sessionConfig, dbInfo, }) {
    await driver.verifyConnectivity();
    const sessionFactory = () => driver.session(sessionConfig);
    const errors = [];
    try {
        (0, verify_version_1.verifyVersion)(dbInfo);
    }
    catch (e) {
        errors.push(e.message);
    }
    try {
        await (0, verify_functions_1.verifyFunctions)(sessionFactory);
    }
    catch (e) {
        errors.push(e.message);
    }
    if (errors.length) {
        throw new Error(`Encountered the following DBMS compatiblility issues:\n${errors.join("\n")}`);
    }
}
exports.default = checkNeo4jCompat;
//# sourceMappingURL=verify-database.js.map