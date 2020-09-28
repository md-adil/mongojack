import { Cursor, FilterQuery, FindOneOptions } from "mongodb";
import Model, { ModelConstructor } from "./model";
import Pagination from "./pagination";
export default class QueryBuilder<M extends Model<P>, P> {
    Model: ModelConstructor<M, P>;
    protected _query: Record<string, string | number>;
    protected _options: FindOneOptions<P>;
    static pageSize: number;
    hasObserver: boolean;
    constructor(Model: ModelConstructor<M, P>);
    noObserve(): this;
    get query(): Record<string, string | number>;
    get options(): FindOneOptions<P>;
    find(): Promise<M[]>;
    first(): Promise<M | null>;
    take(n: FindOneOptions<P>["limit"]): this;
    skip(n: FindOneOptions<P>["skip"]): this;
    sort(n: FindOneOptions<P>["sort"]): this;
    where(name: keyof P | FilterQuery<P>, value?: any): this;
    project(p: FindOneOptions<P>["projection"]): void;
    clone(): QueryBuilder<M, P>;
    create(props: Omit<P, "_id">): Promise<M>;
    createMany(props: Omit<P, "_id">[]): Promise<import("mongodb").InsertWriteOpResult<any>>;
    update(items: Partial<P>): Promise<import("mongodb").UpdateWriteOpResult>;
    delete(): Promise<import("mongodb").DeleteWriteOpResultObject>;
    modelify(data: AsyncGenerator<P> | Cursor<P>): Promise<M[]>;
    count(): Promise<number>;
    paginate(page?: number | string, limit?: number): Pagination<M, P>;
    [Symbol.asyncIterator](): AsyncGenerator<M, void, unknown>;
}
//# sourceMappingURL=query-builder.d.ts.map