export type FilterFn<T> = (rootValue: T) => boolean | Promise<boolean>;
export declare function filterAsyncIterator<T>(asyncIterator: AsyncIterator<T>, filterFn: FilterFn<T>): AsyncIterableIterator<T>;
//# sourceMappingURL=filter-async-iterator.d.ts.map