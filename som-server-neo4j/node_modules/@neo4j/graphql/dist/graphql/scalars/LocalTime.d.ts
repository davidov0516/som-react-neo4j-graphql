import { GraphQLScalarType } from "graphql";
export declare const LOCAL_TIME_REGEX: RegExp;
export declare const parseLocalTime: (value: unknown) => {
    hour: number;
    minute: number;
    second: number;
    nanosecond: number;
};
export declare const GraphQLLocalTime: GraphQLScalarType<unknown, string>;
//# sourceMappingURL=LocalTime.d.ts.map