import Model, { ModelConstructor } from "./model";
export default class QueryBuilder<M extends Model<P>, P> {
    Model: ModelConstructor<P, M>;
    private _query;
    private _limit?;
    private _skip?;
    private _selector?;
    static paginateSize: number;
    constructor(Model: ModelConstructor<P, M>);
    find(limit?: number, skip?: number): Promise<M[]>;
    take(n: number): this;
    skip(n: number): void;
    where(name: string, value: any): this;
    select(...fields: (string | Record<string, number>)[]): this;
    clone(): QueryBuilder<M, P>;
    create(props: P): Promise<void>;
    delete(): void;
    paginate(page: number, limit?: number): Promise<{
        limit: number;
        page: number;
        pages: number;
        total: number;
        docs: M[];
    }>;
}
//# sourceMappingURL=query-builder.d.ts.map