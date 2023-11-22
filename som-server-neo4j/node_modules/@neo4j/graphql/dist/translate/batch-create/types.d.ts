export type GraphQLCreateInput = Record<string, any>;
export interface TreeDescriptor {
    properties: Set<string>;
    children: Record<string, TreeDescriptor>;
    path: string;
}
export declare class UnsupportedUnwindOptimization extends Error {
    readonly name: any;
    constructor(message: string);
}
//# sourceMappingURL=types.d.ts.map