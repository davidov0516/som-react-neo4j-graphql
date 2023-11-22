import type { RelationField } from "../../../types";
import type { Visitor, INestedCreateAST } from "./types";
import type { Node, Relationship } from "../../../classes";
import { AST } from "./AST";
export declare class NestedCreateAST extends AST implements INestedCreateAST {
    node: Node;
    parent: Node;
    nodeProperties: string[];
    edgeProperties: string[];
    relationshipPropertyPath: string;
    relationship: [RelationField | undefined, Node[]];
    edge: Relationship | undefined;
    constructor(node: Node, parent: Node, nodeProperties: string[], edgeProperties: string[], relationshipPropertyPath: string, relationship: [RelationField | undefined, Node[]], edge?: Relationship);
    accept(visitor: Visitor): void;
}
//# sourceMappingURL=NestedCreateAST.d.ts.map