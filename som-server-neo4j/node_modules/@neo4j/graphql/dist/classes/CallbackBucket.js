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
exports.CallbackBucket = void 0;
class CallbackBucket {
    constructor(context) {
        this.context = context;
        this.callbacks = [];
    }
    addCallback(callback) {
        this.callbacks.push(callback);
    }
    async resolveCallbacksAndFilterCypher(options) {
        const params = {};
        let cypher = options.cypher;
        await Promise.all(this.callbacks.map(async (cb) => {
            const callbackFunction = (this.context.features.populatedBy?.callbacks)[cb.functionName];
            const param = await callbackFunction(cb.parent, {}, this.context);
            if (param === undefined) {
                cypher = cypher
                    .split("\n")
                    .filter((line) => !line.includes(`$resolvedCallbacks.${cb.paramName}`))
                    .join("\n");
            }
            params[cb.paramName] = param;
        }));
        return { cypher, params };
    }
}
exports.CallbackBucket = CallbackBucket;
//# sourceMappingURL=CallbackBucket.js.map