export type SubscriptionsEventType = "create_relationship" | "delete_relationship";
type EventMetaParameters = EventMetaTypenameParameters | EventMetaLabelsParameters;
type EventMetaCommonParameters = {
    event: SubscriptionsEventType;
    relVariable: string;
    typename: string;
    fromVariable: string;
    toVariable: string;
};
type EventMetaTypenameParameters = EventMetaCommonParameters & {
    fromTypename: string;
    toTypename: string;
};
type EventMetaLabelsParameters = EventMetaCommonParameters & {
    fromLabels: string;
    toLabels: string;
    toProperties: string;
    fromProperties: string;
};
export declare function createConnectionEventMeta(params: EventMetaParameters): string;
export declare function createConnectionEventMetaObject(eventMeta: EventMetaParameters): string;
export {};
//# sourceMappingURL=create-connection-event-meta.d.ts.map