import { Cursor, FindOneOptions } from "mongodb";
import { nextTick } from "process";
import Model, { ModelConstructor } from "./model";

interface IQueryOption {
  limit?: number;
}
export default class QueryBuilder<M extends Model<P>, P> {
  protected _query: Record<string, string | number> = {};
  protected _options: FindOneOptions<P> = {};

  static pageSize = 25;

  // eslint-disable-next-line no-shadow
  constructor(public Model: ModelConstructor<P, M>) {}

  async find() {
    console.log("options", this._options);
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
    return new this.Model(row);
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

  where(name: string, value: any) {
    this._query[name] = value;
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

  async create(props: Omit<P, "_id">) {
    const observer = this.Model.observer;
    const record = new this.Model(props as any);
    if (observer && observer.creating) {
      await observer.creating(record);
    }
    await record.save();
    if (observer && observer.created) {
      observer.created(record);
    }
    return record;
  }

  delete() {}

  async modelify(data: AsyncGenerator<P> | Cursor<P>) {
    const rows: M[] = [];
    for await (const row of data) {
      rows.push(new this.Model(row));
    }
    return rows;
  }

  async paginate(page: number, limit: number = QueryBuilder.pageSize) {
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

  [Symbol.asyncIterator]() {
    const cursor = this.Model.collection.find<P>(this._query, this._options as any);
    const Model = this.Model;
    return {
      async next() {
        const row = await cursor.next();
        if (!row) {
          return { done: true }
        }
        return { done: false, value: new Model(row) };
      }
    }
  }
}

