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
exports.filterAsyncIterator = void 0;
// Based on https://github.com/apollographql/graphql-subscriptions/blob/master/src/with-filter.ts
function filterAsyncIterator(asyncIterator, filterFn) {
    return {
        next() {
            return getNextPromise(asyncIterator, filterFn);
        },
        return() {
            return asyncIterator.return();
        },
        throw(error) {
            return asyncIterator.throw(error);
        },
        [Symbol.asyncIterator]() {
            return this;
        },
    };
}
exports.filterAsyncIterator = filterAsyncIterator;
function getNextPromise(asyncIterator, filterFn) {
    return new Promise((resolve, reject) => {
        const inner = () => {
            asyncIterator
                .next()
                .then((payload) => {
                if (payload.done === true) {
                    resolve(payload);
                    return;
                }
                Promise.resolve(filterFn(payload.value))
                    .then((filterResult) => {
                    if (filterResult === true) {
                        resolve(payload);
                    }
                    else {
                        // Skip the current value and wait for the next one
                        inner();
                    }
                })
                    .catch((err) => {
                    reject(err);
                });
            })
                .catch((err) => {
                reject(err);
            });
        };
        inner();
    });
}
//# sourceMappingURL=filter-async-iterator.js.map