import type { DirectiveNode, ObjectTypeDefinitionNode } from "graphql";
import type { FullText } from "../../types";
import type { ObjectFields } from "../get-obj-field-meta";
declare function parseFulltextDirective({ directive, nodeFields, definition, }: {
    directive: DirectiveNode;
    nodeFields: ObjectFields;
    definition: ObjectTypeDefinitionNode;
}): FullText;
export default parseFulltextDirective;
//# sourceMappingURL=parse-fulltext-directive.d.ts.map