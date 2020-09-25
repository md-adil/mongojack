import QueryBuilder from "./query-builder";
import Model from "./model";
declare class Pagination<M extends Model<P>, P> {
    readonly queryBuilder: QueryBuilder<M, P>;
    constructor(queryBuilder: QueryBuilder<M, P>);
    [Symbol.asyncIterator](): void;
    total(): Promise<void>;
    pages(): Promise<void>;
    toJSON(): {
        limit: number;
        page: number;
        pages: number;
        data: never[];
    };
    toObject(): Promise<void>;
    data(): Promise<void>;
}
export default Pagination;
//# sourceMappingURL=pagination.d.ts.map