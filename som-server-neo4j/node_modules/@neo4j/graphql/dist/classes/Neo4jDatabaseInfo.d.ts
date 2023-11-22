import * as semver from "semver";
import type { Executor } from "./Executor";
export type Neo4jEdition = "enterprise" | "community";
export declare class Neo4jDatabaseInfo {
    private rawVersion;
    version: semver.SemVer;
    edition: Neo4jEdition | undefined;
    constructor(version: string, edition?: Neo4jEdition);
    private toSemVer;
    toString(): string;
    eq(version: string): boolean;
    gt(version: string): boolean;
    gte(version: string): boolean;
    lt(version: string): boolean;
    lte(version: string): boolean;
}
export declare function getNeo4jDatabaseInfo(executor: Executor): Promise<Neo4jDatabaseInfo>;
//# sourceMappingURL=Neo4jDatabaseInfo.d.ts.map