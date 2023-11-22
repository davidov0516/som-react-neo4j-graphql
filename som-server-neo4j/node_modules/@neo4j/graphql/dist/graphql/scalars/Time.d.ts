import { GraphQLScalarType } from "graphql";
export declare const TIME_REGEX: RegExp;
type ParsedTime = {
    hour: number;
    minute: number;
    second: number;
    nanosecond: number;
    timeZoneOffsetSeconds: number;
};
export declare const parseTime: (value: unknown) => ParsedTime;
export declare const GraphQLTime: GraphQLScalarType<unknown, string>;
export {};
//# sourceMappingURL=Time.d.ts.map