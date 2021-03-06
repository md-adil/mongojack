import { Cursor, FilterQuery, FindOneOptions, ObjectID } from "mongodb";
import Model, { ModelConstructor } from "./model";
import Pagination from "./pagination";
export default class QueryBuilder<M extends Model<P>, P> {
    Model: ModelConstructor<M, P>;
    protected _query: Record<string, string | number>;
    protected _options: FindOneOptions<P>;
    static pageSize: number;
    protected hasObserver: boolean;
    protected hasSchema: boolean;
    constructor(Model: ModelConstructor<M, P>);
    noObserver(): this;
    noSchema(): this;
    get query(): Record<string, string | number>;
    get options(): FindOneOptions<P>;
    find(): Promise<M[]>;
    first(): Promise<M | null>;
    findById(id: string | ObjectID): Promise<M | null>;
    take(n: FindOneOptions<P>["limit"]): this;
    skip(n: FindOneOptions<P>["skip"]): this;
    sort(n: FindOneOptions<P>["sort"]): this;
    where(name: keyof P | FilterQuery<P>, value?: any): this;
    project(p: FindOneOptions<P>["projection"]): void;
    clone(): QueryBuilder<M, P>;
    create(props: Partial<P>): Promise<M>;
    createMany(props: Partial<P>[]): Promise<M[]>;
    increment(values: Partial<P>): Promise<number>;
    multiply(values: Partial<P>): Promise<number>;
    push(values: any): Promise<number>;
    pull(values: any): Promise<number>;
    unset(fields: string[]): Promise<number>;
    update(values: Partial<P>): Promise<import("mongodb").UpdateWriteOpResult>;
    delete(): Promise<import("mongodb").DeleteWriteOpResultObject>;
    modelify(data: AsyncGenerator<P> | Cursor<P>): Promise<M[]>;
    count(): Promise<number>;
    paginate(page?: number | string, limit?: number): Pagination<M, P>;
    [Symbol.asyncIterator](): AsyncGenerator<M, void, unknown>;
}
//# sourceMappingURL=query-builder.d.ts.map