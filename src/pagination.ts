import QueryBuilder from "./query-builder";
import Model from "./model";
import { Error } from "./error";

export interface IResult<M> {
    total: number;
    limit: number;
    page: number;
    pages: number;
    data: M[];
}

class Pagination<M extends Model<P>, P> {
    static pageSize = 25;
    _total?: number;
    _rows?: M[];

    constructor(
        public readonly queryBuilder: QueryBuilder<M, P>,
        public readonly page: number,
        public readonly limit = Pagination.pageSize
    ) {
    }
  

    public async total() {
        if (this._total === undefined) {
            this._total = await this.queryBuilder.count();
        }
        return this._total!;
    }
    
    get offset() {
        return (this.page - 1) * this.limit;
    }

    public async pages() {
        return Math.ceil(await this.total() / this.limit);
    }

    async then(callback: (result: IResult<M>) => void | Promise<any>) {
        callback(await this.toObject());
    }

    catch(callback: (err: Error) => void | Promise<any>) {
        return this.toObject().catch(callback);
    }

    public toJSON() {
      
    }

    public async toObject(): Promise<IResult<M>> {
        return {
            total: await this.total(),
            limit: this.limit,
            page: this.page,
            pages: await this.pages(),
            data: await this.data()
        }
    }

    public async data() {
        if (this._rows === undefined) {
            this._rows = await this.queryBuilder.take(this.limit).skip(this.offset).find();
        }
        return this._rows;
    }

    async *[Symbol.asyncIterator]() {
        if (this._rows) {
            for(const row of this._rows) {
                yield row;
            }
            return;
        }
        const rows: M[] = [];
        for await (const row of this.queryBuilder.take(this.limit).skip(this.offset)) {
            rows.push(row);
            yield row;
        }
        this._rows = rows;
    }
}

export default Pagination;
