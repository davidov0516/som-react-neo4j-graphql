import Cypher from "@neo4j/cypher-builder";
/**
 * caseWhere is a function that behaves like a WHERE filter appended after an OPTIONAL MATCH, it takes a predicate and a list of CypherVariable and returns a Clause.
 * If the predicate is true then it returns these variables, if the predicate is false then it returns a list of NULLs instead.
 * This is helpful when a Cypher block needs to be put between an OPTIONAL MATCH and a WHERE making the WHERE filter no longer optional.
 */
export declare function caseWhere(predicate: Cypher.Predicate, columns: Cypher.Variable[]): Cypher.Clause;
//# sourceMappingURL=case-where.d.ts.map