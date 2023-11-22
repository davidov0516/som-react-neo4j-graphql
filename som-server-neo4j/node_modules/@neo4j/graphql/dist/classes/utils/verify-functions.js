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
exports.verifyFunctions = void 0;
const constants_1 = require("../../constants");
async function verifyFunctions(sessionFactory) {
    const session = sessionFactory();
    const cypher = `
        SHOW FUNCTIONS
        YIELD name
        WHERE name IN ["${constants_1.REQUIRED_APOC_FUNCTIONS.join('", "')}"]
        RETURN collect(name) as functions
    `;
    try {
        const result = await session.run(cypher);
        const record = result.records[0]?.toObject();
        if (!record)
            throw new Error("verifyFunctions failed to get functions");
        const missingFunctions = constants_1.REQUIRED_APOC_FUNCTIONS.filter((f) => !record.functions.includes(f));
        if (missingFunctions.length) {
            throw new Error(`Missing APOC functions: [ ${missingFunctions.join(", ")} ]`);
        }
    }
    finally {
        await session.close();
    }
}
exports.verifyFunctions = verifyFunctions;
//# sourceMappingURL=verify-functions.js.map