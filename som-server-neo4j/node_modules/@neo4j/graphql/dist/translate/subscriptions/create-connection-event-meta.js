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
exports.createConnectionEventMetaObject = exports.createConnectionEventMeta = void 0;
const constants_1 = require("../../constants");
function isEventMetaWithTypenames(event) {
    return !!event["fromTypename"];
}
function projectAllProperties(varName) {
    return `${varName} { .* }`;
}
function createConnectionEventMeta(params) {
    return `${constants_1.META_CYPHER_VARIABLE} + ${createConnectionEventMetaObject(params)} AS ${constants_1.META_CYPHER_VARIABLE}`;
}
exports.createConnectionEventMeta = createConnectionEventMeta;
function createConnectionEventMetaObject(eventMeta) {
    const { event, relVariable, typename, fromVariable, toVariable } = eventMeta;
    const commonFieldsStr = `event: "${event}", timestamp: timestamp()`;
    const identifiersStr = `id_from: id(${fromVariable}), id_to: id(${toVariable}), id: id(${relVariable})`;
    if (isEventMetaWithTypenames(eventMeta)) {
        return `{ ${[
            commonFieldsStr,
            identifiersStr,
            `relationshipName: "${typename}", fromTypename: "${eventMeta.fromTypename}", toTypename: "${eventMeta.toTypename}"`,
            `properties: { from: ${projectAllProperties(fromVariable)}, to: ${projectAllProperties(toVariable)}, relationship: ${projectAllProperties(relVariable)} }`,
        ].join(", ")} }`;
    }
    else {
        return `{ ${[
            commonFieldsStr,
            identifiersStr,
            `relationshipName: ${typename}, fromLabels: ${eventMeta.fromLabels}, toLabels: ${eventMeta.toLabels}`,
            `properties: { from: ${eventMeta.fromProperties}, to: ${eventMeta.toProperties}, relationship: ${projectAllProperties(relVariable)} }`,
        ].join(", ")} }`;
    }
}
exports.createConnectionEventMetaObject = createConnectionEventMetaObject;
//# sourceMappingURL=create-connection-event-meta.js.map