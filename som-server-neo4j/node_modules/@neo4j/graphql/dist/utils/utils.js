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
exports.omitFields = exports.delay = exports.removeDuplicates = exports.haveSharedElement = exports.filterTruthy = exports.asArray = exports.joinStrings = exports.toNumber = exports.isNeoInt = exports.haveSameLength = exports.isSameType = exports.isObject = exports.isString = void 0;
const neo4j_driver_1 = require("neo4j-driver");
/** Checks if value is string */
function isString(value) {
    return typeof value === "string";
}
exports.isString = isString;
/** Checks if value is object (array not included) */
function isObject(value) {
    return typeof value === "object" && !Array.isArray(value) && value !== null;
}
exports.isObject = isObject;
/** Checks if two value have the same type */
function isSameType(a, b) {
    return typeof a === typeof b && isObject(a) === isObject(b) && Array.isArray(a) === Array.isArray(b);
}
exports.isSameType = isSameType;
/** Checks if two objects have the number of properties */
function haveSameLength(o1, o2) {
    return Object.keys(o1).length === Object.keys(o2).length;
}
exports.haveSameLength = haveSameLength;
/** Checks if value is a Neo4j int object */
function isNeoInt(value) {
    return (0, neo4j_driver_1.isInt)(value);
}
exports.isNeoInt = isNeoInt;
/** Transforms a value to number, if possible */
function toNumber(value) {
    return isNeoInt(value) ? value.toNumber() : value;
}
exports.toNumber = toNumber;
/** Joins all strings with given separator, ignoring empty or undefined statements */
function joinStrings(statements, separator = "\n") {
    return filterTruthy(asArray(statements)).join(separator);
}
exports.joinStrings = joinStrings;
/** Makes sure input is an array, if not it turns into an array (empty array if input is null or undefined) */
function asArray(raw) {
    if (Array.isArray(raw))
        return raw;
    if (raw === undefined || raw === null)
        return [];
    return [raw];
}
exports.asArray = asArray;
/** Filter all elements in an array, only leaving truthy values */
function filterTruthy(arr) {
    return arr.filter((v) => !!v);
}
exports.filterTruthy = filterTruthy;
/** Check if both arrays share at least one element */
function haveSharedElement(arr1, arr2) {
    for (const element of arr1) {
        if (arr2.includes(element))
            return true;
    }
    return false;
}
exports.haveSharedElement = haveSharedElement;
/** Removes duplicate elements of an array */
function removeDuplicates(arr) {
    return Array.from(new Set(arr));
}
exports.removeDuplicates = removeDuplicates;
/** Awaitable version of setTimeout */
function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
exports.delay = delay;
/** Omits fields from record */
function omitFields(obj, fields) {
    return Object.entries(obj)
        .filter((item) => !fields.includes(item[0]))
        .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
}
exports.omitFields = omitFields;
//# sourceMappingURL=utils.js.map