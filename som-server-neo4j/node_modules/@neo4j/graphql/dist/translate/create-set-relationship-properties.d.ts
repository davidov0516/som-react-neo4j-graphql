import type { CallbackBucket } from "../classes/CallbackBucket";
import type { Relationship } from "../classes";
declare function createSetRelationshipProperties({ properties, varName, withVars, relationship, operation, callbackBucket, parameterPrefix, }: {
    properties: Record<string, unknown>;
    varName: string;
    withVars: string[];
    relationship: Relationship;
    operation: "CREATE" | "UPDATE";
    callbackBucket: CallbackBucket;
    parameterPrefix: string;
}): string;
export default createSetRelationshipProperties;
//# sourceMappingURL=create-set-relationship-properties.d.ts.map