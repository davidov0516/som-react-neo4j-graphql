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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIndexesAndConstraints = void 0;
const debug_1 = __importDefault(require("debug"));
const constants_1 = require("../../constants");
const debug = (0, debug_1.default)(constants_1.DEBUG_EXECUTE);
async function assertIndexesAndConstraints({ driver, sessionConfig, nodes, options, }) {
    await driver.verifyConnectivity();
    const session = driver.session(sessionConfig);
    try {
        if (options?.create) {
            await createIndexesAndConstraints({ nodes, session });
        }
        else {
            await checkIndexesAndConstraints({ nodes, session });
        }
    }
    finally {
        await session.close();
    }
}
exports.assertIndexesAndConstraints = assertIndexesAndConstraints;
async function createIndexesAndConstraints({ nodes, session }) {
    const constraintsToCreate = await getMissingConstraints({ nodes, session });
    const indexesToCreate = [];
    const existingIndexes = {};
    const indexErrors = [];
    const indexesCypher = "SHOW INDEXES";
    debug(`About to execute Cypher: ${indexesCypher}`);
    const indexesResult = await session.run(indexesCypher);
    indexesResult.records.forEach((record) => {
        const index = record.toObject();
        if (index.type !== "FULLTEXT" || index.entityType !== "NODE") {
            return;
        }
        if (existingIndexes[index.name]) {
            return;
        }
        existingIndexes[index.name] = {
            labelsOrTypes: index.labelsOrTypes,
            properties: index.properties,
        };
    });
    nodes.forEach((node) => {
        if (node.fulltextDirective) {
            node.fulltextDirective.indexes.forEach((index) => {
                // TODO: remove indexName assignment and undefined check once the name argument has been removed.
                const indexName = index.indexName || index.name;
                if (indexName === undefined) {
                    throw new Error("The name of the fulltext index should be defined using the indexName argument.");
                }
                const existingIndex = existingIndexes[indexName];
                if (!existingIndex) {
                    const properties = index.fields.map((field) => {
                        const stringField = node.primitiveFields.find((f) => f.fieldName === field);
                        return stringField?.dbPropertyName || field;
                    });
                    indexesToCreate.push({
                        indexName: indexName,
                        label: node.getMainLabel(),
                        properties,
                    });
                }
                else {
                    index.fields.forEach((field) => {
                        const stringField = node.primitiveFields.find((f) => f.fieldName === field);
                        const fieldName = stringField?.dbPropertyNameUnescaped || field;
                        const property = existingIndex.properties.find((p) => p === fieldName);
                        if (!property) {
                            const aliasError = stringField?.dbPropertyNameUnescaped
                                ? ` aliased to field '${fieldName}'`
                                : "";
                            indexErrors.push(`@fulltext index '${indexName}' on Node '${node.name}' already exists, but is missing field '${fieldName}'${aliasError}`);
                        }
                    });
                }
            });
        }
    });
    if (indexErrors.length) {
        throw new Error(indexErrors.join("\n"));
    }
    for (const constraintToCreate of constraintsToCreate) {
        const cypher = [
            `CREATE CONSTRAINT ${constraintToCreate.constraintName}`,
            `IF NOT EXISTS FOR (n:${constraintToCreate.label})`,
            `REQUIRE n.${constraintToCreate.property} IS UNIQUE`,
        ].join(" ");
        debug(`About to execute Cypher: ${cypher}`);
        const result = await session.run(cypher);
        const { constraintsAdded } = result.summary.counters.updates();
        debug(`Created ${constraintsAdded} new constraint${constraintsAdded ? "" : "s"}`);
    }
    for (const indexToCreate of indexesToCreate) {
        const cypher = [
            `CREATE FULLTEXT INDEX ${indexToCreate.indexName}`,
            `IF NOT EXISTS FOR (n:${indexToCreate.label})`,
            `ON EACH [${indexToCreate.properties.map((p) => `n.${p}`).join(", ")}]`,
        ].join(" ");
        debug(`About to execute Cypher: ${cypher}`);
        await session.run(cypher);
        debug(`Created @fulltext index ${indexToCreate.indexName}`);
    }
}
async function checkIndexesAndConstraints({ nodes, session }) {
    const missingConstraints = await getMissingConstraints({ nodes, session });
    if (missingConstraints.length) {
        const missingConstraintMessages = missingConstraints.map((constraint) => `Missing constraint for ${constraint.label}.${constraint.property}`);
        throw new Error(missingConstraintMessages.join("\n"));
    }
    debug("Successfully checked for the existence of all necessary constraints");
    const existingIndexes = {};
    const indexErrors = [];
    const indexesCypher = "SHOW INDEXES";
    debug(`About to execute Cypher: ${indexesCypher}`);
    const indexesResult = await session.run(indexesCypher);
    indexesResult.records.forEach((record) => {
        const index = record.toObject();
        if (index.type !== "FULLTEXT" || index.entityType !== "NODE") {
            return;
        }
        if (existingIndexes[index.name]) {
            return;
        }
        existingIndexes[index.name] = {
            labelsOrTypes: index.labelsOrTypes,
            properties: index.properties,
        };
    });
    nodes.forEach((node) => {
        if (node.fulltextDirective) {
            node.fulltextDirective.indexes.forEach((index) => {
                // TODO: remove indexName assignment and undefined check once the name argument has been removed.
                const indexName = index.indexName || index.name;
                if (indexName === undefined) {
                    throw new Error("The name of the fulltext index should be defined using the indexName argument.");
                }
                const existingIndex = existingIndexes[indexName];
                if (!existingIndex) {
                    indexErrors.push(`Missing @fulltext index '${indexName}' on Node '${node.name}'`);
                    return;
                }
                index.fields.forEach((field) => {
                    const stringField = node.primitiveFields.find((f) => f.fieldName === field);
                    const fieldName = stringField?.dbPropertyNameUnescaped || field;
                    const property = existingIndex.properties.find((p) => p === fieldName);
                    if (!property) {
                        const aliasError = stringField?.dbPropertyNameUnescaped
                            ? ` aliased to field '${fieldName}'`
                            : "";
                        indexErrors.push(`@fulltext index '${indexName}' on Node '${node.name}' is missing field '${field}'${aliasError}`);
                    }
                });
            });
        }
    });
    if (indexErrors.length) {
        throw new Error(indexErrors.join("\n"));
    }
    debug("Successfully checked for the existence of all necessary indexes");
}
async function getMissingConstraints({ nodes, session, }) {
    const existingConstraints = {};
    const constraintsCypher = "SHOW UNIQUE CONSTRAINTS";
    debug(`About to execute Cypher: ${constraintsCypher}`);
    const constraintsResult = await session.run(constraintsCypher);
    constraintsResult.records
        .map((record) => {
        return record.toObject();
    })
        .forEach((constraint) => {
        // These will always be defined.
        const label = constraint.labelsOrTypes[0];
        const property = constraint.properties[0];
        const existingConstraint = existingConstraints[label];
        if (existingConstraint) {
            existingConstraint.push(property);
        }
        else {
            existingConstraints[label] = [property];
        }
    });
    const missingConstraints = [];
    nodes.forEach((node) => {
        node.uniqueFields.forEach((field) => {
            const property = field.dbPropertyNameUnescaped || field.fieldName;
            if (node.getAllLabels().every((label) => !existingConstraints[label]?.includes(property))) {
                missingConstraints.push({
                    constraintName: field.unique.constraintName,
                    label: node.getMainLabel(),
                    property,
                });
            }
        });
    });
    return missingConstraints;
}
//# sourceMappingURL=asserts-indexes-and-constraints.js.map