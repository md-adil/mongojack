import QueryBuilder from "./query-builder";
import Model from "./model";
import { Error } from "./error";
interface IResult<M> {
    total: number;
    limit: number;
    page: number;
    pages: number;
    data: M[];
}
declare class Pagination<M extends Model<P>, P> {
    readonly queryBuilder: QueryBuilder<M, P>;
    readonly page: number;
    readonly limit: number;
    static pageSize: number;
    _total?: number;
    _rows?: M[];
    constructor(queryBuilder: QueryBuilder<M, P>, page: number, limit?: number);
    total(): Promise<number>;
    get offset(): number;
    pages(): Promise<number>;
    then(callback: (result: IResult<M>) => void | Promise<any>): Promise<void>;
    catch(callback: (err: Error) => void | Promise<any>): Promise<any>;
    toJSON(): void;
    toObject(): Promise<IResult<M>>;
    data(): Promise<M[]>;
    [Symbol.asyncIterator](): AsyncGenerator<M, void, unknown>;
}
export default Pagination;
//# sourceMappingURL=pagination.d.ts.map