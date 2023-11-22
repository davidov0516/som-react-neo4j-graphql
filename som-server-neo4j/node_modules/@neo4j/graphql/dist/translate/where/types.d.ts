export type NumericalWhereOperator = "GT" | "GTE" | "LT" | "LTE";
export type SpatialWhereOperator = "DISTANCE";
export type StringWhereOperator = "CONTAINS" | "STARTS_WITH" | "ENDS_WITH";
export type RegexWhereOperator = "MATCHES";
export type ArrayWhereOperator = "IN" | "INCLUDES";
export type RelationshipWhereOperator = "ALL" | "NONE" | "SINGLE" | "SOME";
export type WhereOperator = "NOT" | NumericalWhereOperator | SpatialWhereOperator | StringWhereOperator | `NOT_${StringWhereOperator}` | RegexWhereOperator | ArrayWhereOperator | `NOT_${ArrayWhereOperator}` | RelationshipWhereOperator;
//# sourceMappingURL=types.d.ts.map