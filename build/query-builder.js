"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pagination_1 = __importDefault(require("./pagination"));
class QueryBuilder {
    // eslint-disable-next-line no-shadow
    constructor(Model) {
        this.Model = Model;
        this._query = {};
        this._options = {};
        this.hasObserver = true;
    }
    noObserve() {
        this.hasObserver = false;
        return this;
    }
    async find() {
        const querybuilder = this.Model.collection.find(this._query, this._options);
        const rows = [];
        for await (const row of querybuilder) {
            rows.push(new this.Model(row));
        }
        return rows;
    }
    async first() {
        const row = await this.Model.collection.findOne(this._query, this._options);
        if (!row) {
            return null;
        }
        return new this.Model(row, false);
    }
    take(n) {
        this._options.limit = n;
        return this;
    }
    skip(n) {
        this._options.skip = n;
        return this;
    }
    sort(n) {
        this._options.sort = n;
        return this;
    }
    where(name, value) {
        if (typeof name === "string") {
            this._query[name] = value;
        }
        else {
            Object.assign(this._query, name);
        }
        return this;
    }
    project(p) {
        this._options.projection = p;
    }
    clone() {
        const cloned = new QueryBuilder(this.Model);
        cloned._query = this._query;
        cloned._options = this._options;
        return cloned;
    }
    create(props) {
        const record = new this.Model(props);
        record.hasObserve = this.hasObserver;
        return record.save();
    }
    createMany(props) {
        return this.Model.collection.insertMany(props);
    }
    update(items) {
        return this.Model.collection.updateMany(this._query, items);
    }
    delete() {
        return this.Model.collection.deleteMany(this._query);
    }
    async modelify(data) {
        const rows = [];
        for await (const row of data) {
            rows.push(new this.Model(row, false));
        }
        return rows;
    }
    count() {
        return this.Model.collection.countDocuments(this._query);
    }
    paginate(page, limit) {
        return new pagination_1.default(this, page, limit);
    }
    async paginateRaw(page, limit = QueryBuilder.pageSize) {
        const total = await this.Model.collection.countDocuments(this._query);
        const options = { ...this._options, limit, skip: (page - 1) * limit };
        const docs = await this.modelify(this.Model.collection.find(this._query, options));
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
        for await (const row of this.Model.collection.find(this._query, this._options)) {
            yield new this.Model(row, false);
        }
    }
}
exports.default = QueryBuilder;
QueryBuilder.pageSize = 25;
