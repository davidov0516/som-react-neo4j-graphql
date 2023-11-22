import { GraphQLScalarType } from "graphql";
export declare const parseLocalDateTime: (value: unknown) => {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    nanosecond: number;
};
export declare const GraphQLLocalDateTime: GraphQLScalarType<unknown, string>;
//# sourceMappingURL=LocalDateTime.d.ts.map