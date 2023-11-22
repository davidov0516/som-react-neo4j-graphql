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
exports.parseSelectionSetForAuthenticated = void 0;
const upper_first_1 = require("../../../../utils/upper-first");
function parseSelectionSetForAuthenticated({ resolveTree, entity, entityTypeName, entityPayloadTypeName, context, }) {
    const authenticated = [];
    const selectionSet = getSelected(resolveTree, entityTypeName);
    for (const [k, selection] of Object.entries(selectionSet)) {
        if (k === entityPayloadTypeName || k === "previousState") {
            const entitySelectedFields = getSelected(selection, TYPE_NAMES.ENTITY_PAYLOAD(entity.name));
            authenticated.push({ entity, fieldSelection: entitySelectedFields });
        }
        if (k === "createdRelationship" || k === "deletedRelationship") {
            const relationshipFieldSelection = getSelected(selection, TYPE_NAMES.RELATIONSHIPS(entity.name));
            for (const relationshipField of Object.values(relationshipFieldSelection)) {
                const targets = getTargetEntities({ context, entity, relationshipField });
                if (!targets) {
                    continue;
                }
                const relationshipSelection = getSelected(relationshipField, TYPE_NAMES.RELATIONSHIP(entity.name, relationshipField.name));
                if (!relationshipSelection["node"]) {
                    // edge fields do not support authentication rules
                    continue;
                }
                const relationshipSelectionByTypeName = relationshipSelection["node"].fieldsByTypeName;
                for (const [typeNameSelection, fieldSelection] of Object.entries(relationshipSelectionByTypeName)) {
                    if (!Object.keys(fieldSelection).length) {
                        continue;
                    }
                    const selectedEntity = targets.find((e) => TYPE_NAMES.ENTITY_PAYLOAD(e.name) === typeNameSelection);
                    if (selectedEntity) {
                        authenticated.push({ entity: selectedEntity, fieldSelection });
                    }
                    else {
                        // interface fields
                        for (const entity of targets) {
                            authenticated.push({ entity, fieldSelection });
                        }
                    }
                }
            }
        }
    }
    return authenticated;
}
exports.parseSelectionSetForAuthenticated = parseSelectionSetForAuthenticated;
function getSelected(from, typeName) {
    return from.fieldsByTypeName[typeName] || {};
}
const TYPE_NAMES = {
    // ideally these should be in the Schema somewhere
    // eg.  Node.subscriptionEventTypeNames
    ENTITY_PAYLOAD: (name) => `${name}EventPayload`,
    RELATIONSHIPS: (name) => `${name}ConnectedRelationships`,
    RELATIONSHIP: (entityName, relationshipName) => `${entityName}${(0, upper_first_1.upperFirst)(relationshipName)}ConnectedRelationship`,
};
function getTargetEntities({ context, entity, relationshipField, }) {
    const relationship = entity.relationships.get(relationshipField.name);
    if (!relationship) {
        return;
    }
    const relationshipTarget = context.schemaModel.getEntity(relationship.target.name);
    if (!relationshipTarget) {
        return;
    }
    if (relationshipTarget.isConcreteEntity()) {
        return [relationshipTarget];
    }
    if (relationshipTarget.isCompositeEntity()) {
        return relationshipTarget.concreteEntities;
    }
}
//# sourceMappingURL=selection-set-parser.js.map