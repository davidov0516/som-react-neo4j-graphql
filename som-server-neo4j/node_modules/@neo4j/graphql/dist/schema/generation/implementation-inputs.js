"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeImplementationsWhereInput = exports.makeImplementationsUpdateInput = exports.makeImplementationsDeleteInput = exports.makeImplementationsConnectInput = exports.makeImplementationsDisconnectInput = void 0;
const ensure_non_empty_input_1 = require("../ensure-non-empty-input");
function makeImplementationsDisconnectInput({ interfaceEntityAdapter, composer, }) {
    const fields = {};
    for (const entityAdapter of interfaceEntityAdapter.concreteEntities) {
        if (entityAdapter.relationships.size) {
            fields[entityAdapter.name] = {
                type: `[${entityAdapter.operations.disconnectInputTypeName}!]`,
            };
        }
    }
    if (!Object.keys(fields).length) {
        return undefined;
    }
    const implementationsDisconnectType = composer.createInputTC({
        name: interfaceEntityAdapter.operations.whereOnImplementationsDisconnectInputTypeName,
        fields,
    });
    (0, ensure_non_empty_input_1.ensureNonEmptyInput)(composer, implementationsDisconnectType);
    return implementationsDisconnectType;
}
exports.makeImplementationsDisconnectInput = makeImplementationsDisconnectInput;
function makeImplementationsConnectInput({ interfaceEntityAdapter, composer, }) {
    const fields = {};
    for (const entityAdapter of interfaceEntityAdapter.concreteEntities) {
        if (entityAdapter.relationships.size) {
            fields[entityAdapter.name] = {
                type: `[${entityAdapter.operations.connectInputTypeName}!]`,
            };
        }
    }
    if (!Object.keys(fields).length) {
        return undefined;
    }
    const implementationsConnectType = composer.createInputTC({
        name: interfaceEntityAdapter.operations.whereOnImplementationsConnectInputTypeName,
        fields,
    });
    // ensureNonEmptyInput(composer, implementationsConnectType);
    return implementationsConnectType;
}
exports.makeImplementationsConnectInput = makeImplementationsConnectInput;
function makeImplementationsDeleteInput({ interfaceEntityAdapter, composer, }) {
    const fields = {};
    for (const entityAdapter of interfaceEntityAdapter.concreteEntities) {
        if (entityAdapter.relationships.size) {
            fields[entityAdapter.name] = {
                type: `[${entityAdapter.operations.deleteInputTypeName}!]`,
            };
        }
    }
    if (!Object.keys(fields).length) {
        return undefined;
    }
    const implementationsDeleteType = composer.createInputTC({
        name: interfaceEntityAdapter.operations.whereOnImplementationsDeleteInputTypeName,
        fields,
    });
    // ensureNonEmptyInput(composer, implementationsDeleteType);
    return implementationsDeleteType;
}
exports.makeImplementationsDeleteInput = makeImplementationsDeleteInput;
function makeImplementationsUpdateInput({ interfaceEntityAdapter, composer, }) {
    const fields = {};
    for (const entityAdapter of interfaceEntityAdapter.concreteEntities) {
        fields[entityAdapter.name] = {
            type: entityAdapter.operations.updateInputTypeName,
        };
    }
    const implementationsUpdateType = composer.createInputTC({
        name: interfaceEntityAdapter.operations.whereOnImplementationsUpdateInputTypeName,
        fields,
    });
    (0, ensure_non_empty_input_1.ensureNonEmptyInput)(composer, implementationsUpdateType);
    return implementationsUpdateType;
}
exports.makeImplementationsUpdateInput = makeImplementationsUpdateInput;
// TODO: maybe combine implementationsInputTypes creation into one function?
function makeImplementationsWhereInput({ interfaceEntityAdapter, composer, }) {
    const fields = {};
    for (const entityAdapter of interfaceEntityAdapter.concreteEntities) {
        fields[entityAdapter.name] = {
            type: entityAdapter.operations.whereInputTypeName,
        };
    }
    const implementationsWhereType = composer.createInputTC({
        name: interfaceEntityAdapter.operations.whereOnImplementationsWhereInputTypeName,
        fields,
    });
    (0, ensure_non_empty_input_1.ensureNonEmptyInput)(composer, implementationsWhereType);
    return implementationsWhereType;
}
exports.makeImplementationsWhereInput = makeImplementationsWhereInput;
//# sourceMappingURL=implementation-inputs.js.map