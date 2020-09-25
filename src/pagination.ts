import QueryBuilder from "./query-builder";
import Model from "./model";
class Pagination<M extends Model<P>, P> {
    constructor(public readonly queryBuilder: QueryBuilder<M, P>) {
    }
    [Symbol.asyncIterator]() {

    }

    public async total() {

    }

    public async pages() {

    }

    public toJSON() {
        return {
            limit: 0,
            page: 1,
            pages: 1,
            data: []
        }
    }

    public async toObject() {

    }

    public async data() {

    }
}

export default Pagination;
