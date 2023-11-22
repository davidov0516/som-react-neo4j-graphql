import type { GraphQLOptionsArg } from "../../../types";
import Cypher from "@neo4j/cypher-builder";
export declare function collectUnionSubqueriesResults({ resultVariable, optionsInput, isArray, }: {
    resultVariable: Cypher.Variable;
    optionsInput: GraphQLOptionsArg;
    isArray: boolean;
}): Cypher.Clause;
//# sourceMappingURL=collect-union-subqueries-results.d.ts.map