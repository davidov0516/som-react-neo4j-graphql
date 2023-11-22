import type { RelationshipWhereOperator, WhereOperator } from "./types";
export declare const comparisonMap: Record<Exclude<WhereOperator, RelationshipWhereOperator>, string>;
export declare const whereRegEx: RegExp;
export type WhereRegexGroups = {
    fieldName: string;
    isAggregate?: string;
    operator?: WhereOperator;
    prefix?: string;
};
export type aggregationOperators = "AVERAGE" | "SHORTEST" | "LONGEST" | "MIN" | "MAX" | "SUM";
export declare const aggregationFieldRegEx: RegExp;
export type AggregationFieldRegexGroups = {
    fieldName: string;
    aggregationOperator?: aggregationOperators;
    logicalOperator?: string;
};
export type ListPredicate = "all" | "none" | "single" | "any" | "not";
export declare const getListPredicate: (operator?: WhereOperator) => ListPredicate;
//# sourceMappingURL=utils.d.ts.map