import type { DirectiveNode, InterfaceTypeDefinitionNode, ObjectTypeDefinitionNode } from "graphql";
import type { Unique } from "../../types";
declare function getUniqueMeta(directives: DirectiveNode[], type: ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode, fieldName: string): Unique | undefined;
export default getUniqueMeta;
//# sourceMappingURL=get-unique-meta.d.ts.map