import { Cursor, FilterQuery, FindOneOptions } from "mongodb";
import Model, { ModelConstructor } from "./model";
import Pagination from "./pagination";

export default class QueryBuilder<M extends Model<P>, P = Record<string, any>> {
  protected _query: Record<string, string | number> = {};
  protected _options: FindOneOptions<P> = {};

  static pageSize = 25;
  hasObserver = true;
  // eslint-disable-next-line no-shadow
  constructor(public Model: ModelConstructor<P, M>) {}
  withoutObserve() {
    this.hasObserver = false;
    return this;
  }


  async find() {
    const querybuilder = this.Model.collection.find<P>(this._query, this._options as any);
    const rows: M[] = [];
    for await (const row of querybuilder) {
      rows.push(new this.Model(row));
    }
    return rows;
  }

  async first() {
    const row = await this.Model.collection.findOne<P>(this._query, this._options as FindOneOptions<any>);
    if (!row) {
      return null;
    }
    return new this.Model(row, false);
  }

  take(n: FindOneOptions<P>["limit"]) {
    this._options.limit = n;
    return this;
  }

  skip(n: FindOneOptions<P>["skip"]) {
    this._options.skip = n;
    return this;
  }

  sort(n: FindOneOptions<P>["sort"]) {
    this._options.sort = n;
    return this;
  }

  where(name: keyof P | FilterQuery<P>, value: any) {
      if (typeof name === "string") {
          this._query[name] = value;
      } else {
          Object.assign(this._query, name);
      }
    return this;
  }

  project(p: FindOneOptions<P>["projection"]) {
    this._options.projection = p;
  }

  clone() {
    const cloned = new QueryBuilder(this.Model);
    cloned._query = this._query;
    cloned._options = this._options;
    return cloned;
  }

    create(props: Omit<P, "_id">) {
        const record = new this.Model(props as any);
        return record.save();
    }

    createMany(props: Omit<P, "_id">[]) {
      return this.Model.collection.insertMany(props);
    }

    update(items: Partial<P>) {
        return this.Model.collection.updateMany(this._query, items);
    }

    delete() {
        return this.Model.collection.deleteMany(this._query);
    }

  async modelify(data: AsyncGenerator<P> | Cursor<P>) {
    const rows: M[] = [];
    for await (const row of data) {
      rows.push(new this.Model(row, false));
    }
    return rows;
  }

  count() {
    return this.Model.collection.countDocuments(this._query);
  }

  paginate(page: number, limit?: number) {
    return new Pagination<M, P>(this, page, limit);
  }

  async paginateRaw(page: number, limit: number = QueryBuilder.pageSize) {
    const total = await this.Model.collection.countDocuments(this._query);
    const options = {...this._options, limit, skip: (page - 1) * limit };
    const docs = await this.modelify(this.Model.collection.find<P>(this._query, options as FindOneOptions<any>));
    const pages = Math.ceil(total / limit);
    return {
        limit,
        page,
        pages,
        total,
        docs
    };
  }

  async *[Symbol.asyncIterator]() {
    for await (const row of this.Model.collection.find<P>(this._query, this._options as any)) {
        yield new this.Model(row, false);
    }
  }
}
