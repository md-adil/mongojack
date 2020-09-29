import { Cursor, FilterQuery, FindOneOptions } from "mongodb";
import Model, { ModelConstructor } from "./model";
import Pagination from "./pagination";

export default class QueryBuilder<M extends Model<P>, P> {
  protected _query: Record<string, string | number> = {};
  protected _options: FindOneOptions<P> = {};

  static pageSize = 25;
  hasObserver = true;
  // eslint-disable-next-line no-shadow
  constructor(public Model: ModelConstructor<M, P>) {}
  noObserve() {
    this.hasObserver = false;
    return this;
  }

  get query() {
    return this._query;
  }

  get options() {
    return this._options;
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

  where(name: keyof P | FilterQuery<P>, value?: any) {
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

    create(props: Partial<P>) {
        const record = new this.Model(props as P);
        record.hasObserve = this.hasObserver;
        return record.save();
    }

    async createMany(props: Partial<P>[]) {
      const observer = this.hasObserver && this.Model.observer;
      const rows = props.map(prop => new this.Model(prop as P));
      if (observer && observer.creating) {
        await Promise.all(rows.map(row => observer.creating(row)));
      }
      const inserted = await this.Model.collection.insertMany(props.map(prop => this.Model.validateSchema(prop)));
      for (let i = 0; i > rows.length; i++) {
        const row = rows[i];
        (row.attributes as any)._id = (inserted as any)[i];
        if (observer && observer.created) {
          observer.created(row);
        }
      }
      return rows;
    }

    async increment() {

    }

    async decrement() {

    }

    async push() {

    }

    async pull() {

    }

    update(items: Partial<P>) {
        return this.Model.collection.updateMany(this._query, {
          $set: this.Model.validateSchema(items, true)
        });
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

  paginate(page?: number | string, limit?: number) {
    if (!page) {
        page = 1;
    }
    if (typeof page === "string") {
      page = parseInt(page, 10);
    }
    return new Pagination<M, P>(this, page, limit);
  }

  async *[Symbol.asyncIterator]() {
    for await (const row of this.Model.collection.find<P>(this._query, this._options as any)) {
        yield new this.Model(row, false);
    }
  }
}
