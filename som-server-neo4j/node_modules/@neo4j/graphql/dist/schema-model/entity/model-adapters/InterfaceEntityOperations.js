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
exports.InterfaceEntityOperations = void 0;
const upper_first_1 = require("../../../utils/upper-first");
class InterfaceEntityOperations {
    constructor(InterfaceEntityAdapter) {
        this.InterfaceEntityAdapter = InterfaceEntityAdapter;
        this.pascalCasePlural = (0, upper_first_1.upperFirst)(this.InterfaceEntityAdapter.plural);
        this.pascalCaseSingular = (0, upper_first_1.upperFirst)(this.InterfaceEntityAdapter.singular);
    }
    get whereInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}Where`;
    }
    get whereOnImplementationsWhereInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}ImplementationsWhere`;
    }
    get uniqueWhereInputTypeName() {
        // ConnectOrCreateWhere.node
        return `${this.InterfaceEntityAdapter.name}UniqueWhere`;
    }
    get connectOrCreateWhereInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}ConnectOrCreateWhere`;
    }
    get connectWhereInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}ConnectWhere`;
    }
    get createInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}CreateInput`;
    }
    get updateInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}UpdateInput`;
    }
    get whereOnImplementationsUpdateInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}ImplementationsUpdateInput`;
    }
    get deleteInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}DeleteInput`;
    }
    get whereOnImplementationsDeleteInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}ImplementationsDeleteInput`;
    }
    get optionsInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}Options`;
    }
    get fullTextInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}Fulltext`;
    }
    get sortInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}Sort`;
    }
    get relationInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}RelationInput`;
    }
    get connectInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}ConnectInput`;
    }
    get connectOrCreateInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}ConnectOrCreateInput`;
    }
    get whereOnImplementationsConnectInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}ImplementationsConnectInput`;
    }
    get disconnectInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}DisconnectInput`;
    }
    get whereOnImplementationsDisconnectInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}ImplementationsDisconnectInput`;
    }
    get onCreateInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}OnCreateInput`;
    }
    get subscriptionWhereInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}SubscriptionWhere`;
    }
    get subscriptionEventPayloadTypeName() {
        return `${this.InterfaceEntityAdapter.name}EventPayload`;
    }
    get implementationsSubscriptionWhereInputTypeName() {
        return `${this.InterfaceEntityAdapter.name}ImplementationsSubscriptionWhere`;
    }
    get rootTypeFieldNames() {
        return {
            create: `create${this.pascalCasePlural}`,
            read: this.InterfaceEntityAdapter.plural,
            update: `update${this.pascalCasePlural}`,
            delete: `delete${this.pascalCasePlural}`,
            aggregate: `${this.InterfaceEntityAdapter.plural}Aggregate`,
            subscribe: {
                created: `${this.InterfaceEntityAdapter.singular}Created`,
                updated: `${this.InterfaceEntityAdapter.singular}Updated`,
                deleted: `${this.InterfaceEntityAdapter.singular}Deleted`,
                relationship_deleted: `${this.InterfaceEntityAdapter.singular}RelationshipDeleted`,
                relationship_created: `${this.InterfaceEntityAdapter.singular}RelationshipCreated`,
            },
        };
    }
    get fulltextTypeNames() {
        return {
            result: `${this.pascalCaseSingular}FulltextResult`,
            where: `${this.pascalCaseSingular}FulltextWhere`,
            sort: `${this.pascalCaseSingular}FulltextSort`,
        };
    }
    get aggregateTypeNames() {
        return {
            selection: `${this.InterfaceEntityAdapter.name}AggregateSelection`,
            input: `${this.InterfaceEntityAdapter.name}AggregateSelectionInput`,
        };
    }
    get mutationResponseTypeNames() {
        return {
            create: `Create${this.pascalCasePlural}MutationResponse`,
            update: `Update${this.pascalCasePlural}MutationResponse`,
        };
    }
    get subscriptionEventTypeNames() {
        return {
            create: `${this.pascalCaseSingular}CreatedEvent`,
            update: `${this.pascalCaseSingular}UpdatedEvent`,
            delete: `${this.pascalCaseSingular}DeletedEvent`,
            create_relationship: `${this.pascalCaseSingular}RelationshipCreatedEvent`,
            delete_relationship: `${this.pascalCaseSingular}RelationshipDeletedEvent`,
        };
    }
    get subscriptionEventPayloadFieldNames() {
        return {
            create: `created${this.pascalCaseSingular}`,
            update: `updated${this.pascalCaseSingular}`,
            delete: `deleted${this.pascalCaseSingular}`,
            create_relationship: `${this.InterfaceEntityAdapter.singular}`,
            delete_relationship: `${this.InterfaceEntityAdapter.singular}`,
        };
    }
    get updateMutationArgumentNames() {
        return {
            connect: `${this.InterfaceEntityAdapter.name}ConnectInput`,
            disconnect: `${this.InterfaceEntityAdapter.name}DisconnectInput`,
            create: this.relationInputTypeName,
            update: this.updateInputTypeName,
            delete: this.deleteInputTypeName,
            connectOrCreate: this.connectOrCreateInputTypeName,
            where: this.whereInputTypeName,
        };
    }
    get createMutationArgumentNames() {
        return {
            input: `[${this.createInputTypeName}!]!`,
        };
    }
    get connectOrCreateWhereInputFieldNames() {
        return {
            node: `${this.uniqueWhereInputTypeName}!`,
        };
    }
}
exports.InterfaceEntityOperations = InterfaceEntityOperations;
//# sourceMappingURL=InterfaceEntityOperations.js.map