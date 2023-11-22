import Cypher from "@neo4j/cypher-builder";
import type { Node } from "../../../classes";
export declare function createGlobalNodeOperation({ node, value, targetElement, coalesceValue, }: {
    node: Node;
    value: string;
    targetElement: Cypher.Variable;
    coalesceValue: string | undefined;
}): Cypher.ComparisonOp;
//# sourceMappingURL=create-global-node-operation.d.ts.map