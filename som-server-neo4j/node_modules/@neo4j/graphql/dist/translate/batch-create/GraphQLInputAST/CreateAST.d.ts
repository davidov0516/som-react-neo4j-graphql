import type { Visitor, ICreateAST } from "./types";
import type { Node } from "../../../classes";
import { AST } from "./AST";
export declare class CreateAST extends AST implements ICreateAST {
    nodeProperties: string[];
    node: Node;
    constructor(nodeProperties: string[], node: Node);
    accept(visitor: Visitor): void;
}
//# sourceMappingURL=CreateAST.d.ts.map