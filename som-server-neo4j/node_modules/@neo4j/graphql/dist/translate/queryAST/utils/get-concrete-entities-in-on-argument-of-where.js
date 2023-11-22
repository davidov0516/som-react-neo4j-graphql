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
exports.getConcreteEntitiesInOnArgumentOfWhere = void 0;
const is_union_entity_1 = require("./is-union-entity");
/**
 * Returns the concrete entities presents in the where [_on] argument,
 * if the where argument is not defined then returns all the concrete entities of the composite target.
 **/
function getConcreteEntitiesInOnArgumentOfWhere(compositeTarget, whereArgs) {
    if ((0, is_union_entity_1.isUnionEntity)(compositeTarget)) {
        return getConcreteEntitiesInOnArgumentOfWhereUnion(compositeTarget, whereArgs);
    }
    else {
        return getConcreteEntitiesInOnArgumentOfWhereInterface(compositeTarget, whereArgs);
    }
}
exports.getConcreteEntitiesInOnArgumentOfWhere = getConcreteEntitiesInOnArgumentOfWhere;
function getConcreteEntitiesInOnArgumentOfWhereInterface(compositeTarget, whereArgs) {
    if (!whereArgs || !whereArgs?._on || countSharedFilters(whereArgs) > 0) {
        return compositeTarget.concreteEntities;
    }
    return getMatchingConcreteEntity(compositeTarget, whereArgs._on);
}
function getConcreteEntitiesInOnArgumentOfWhereUnion(compositeTarget, whereArgs) {
    if (!whereArgs || countObjectKeys(whereArgs) === 0) {
        return compositeTarget.concreteEntities;
    }
    return getMatchingConcreteEntity(compositeTarget, whereArgs);
}
function getMatchingConcreteEntity(compositeTarget, whereArgs) {
    const concreteEntities = [];
    for (const concreteEntity of compositeTarget.concreteEntities) {
        if (whereArgs[concreteEntity.name]) {
            concreteEntities.push(concreteEntity);
        }
    }
    return concreteEntities;
}
function countObjectKeys(obj) {
    return Object.keys(obj).length;
}
function countSharedFilters(whereArgs) {
    return Object.entries(whereArgs).filter(([key]) => key !== "_on").length;
}
//# sourceMappingURL=get-concrete-entities-in-on-argument-of-where.js.map