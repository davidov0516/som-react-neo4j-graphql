import { GraphQLScalarType } from "graphql";
export declare const MONTHS_PER_YEAR = 12;
export declare const DAYS_PER_YEAR = 365.2425;
export declare const DAYS_PER_MONTH: number;
export declare const DAYS_PER_WEEK = 7;
export declare const HOURS_PER_DAY = 24;
export declare const MINUTES_PER_HOUR = 60;
export declare const SECONDS_PER_MINUTE = 60;
export declare const SECONDS_PER_HOUR: number;
export declare const NANOSECONDS_PER_SECOND = 1000000000;
export declare const parseDuration: (value: string) => {
    months: number;
    days: number;
    seconds: number;
    nanoseconds: number;
};
export declare const GraphQLDuration: GraphQLScalarType<unknown, string>;
//# sourceMappingURL=Duration.d.ts.map