export type SubscriptionsEventType = "create" | "update" | "delete";
type EventMetaParameters = {
    event: SubscriptionsEventType;
    nodeVariable: string;
    typename: string;
};
export declare function createEventMeta(params: EventMetaParameters): string;
export declare function createEventMetaObject({ event, nodeVariable, typename }: EventMetaParameters): string;
export {};
//# sourceMappingURL=create-event-meta.d.ts.map