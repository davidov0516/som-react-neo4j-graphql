export interface DecodedGlobalId {
    typeName: string;
    field: string;
    id: string | number;
}
export declare function toGlobalId({ typeName, field, id }: DecodedGlobalId): string;
export declare function fromGlobalId(id: string, isInt?: boolean): DecodedGlobalId;
//# sourceMappingURL=global-ids.d.ts.map