import type { PrimitiveField, PointField, CustomEnumField, CypherField, CustomScalarField, TemporalField, CustomResolverField } from "../types";
import { GraphElement } from "./GraphElement";
export interface RelationshipConstructor {
    name: string;
    type: string;
    description?: string;
    properties?: string;
    cypherFields?: CypherField[];
    primitiveFields?: PrimitiveField[];
    scalarFields?: CustomScalarField[];
    enumFields?: CustomEnumField[];
    temporalFields?: TemporalField[];
    pointFields?: PointField[];
    customResolverFields?: CustomResolverField[];
}
declare class Relationship extends GraphElement {
    properties?: string;
    constructor(input: RelationshipConstructor);
}
export default Relationship;
//# sourceMappingURL=Relationship.d.ts.map