"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    // eslint-disable-next-line no-shadow
    constructor(Model) {
        this.Model = Model;
        this._query = {};
    }
    async find(limit, skip) {
        limit = limit || this._limit;
        skip = skip || this._skip;
        const querybuilder = this.Model.collection.find(this._query, {
            projection: this._selector,
            limit,
            skip,
        });
        const rows = [];
        for await (const row of querybuilder) {
            rows.push(new this.Model(row));
        }
        return rows;
    }
    take(n) {
        this._limit = n;
        return this;
    }
    skip(n) {
        this._skip = n;
    }
    where(name, value) {
        this._query[name] = value;
        return this;
    }
    select(...fields) {
        if (!this._selector) {
            this._selector = {};
        }
        for (const field of fields) {
            if (typeof field === "string") {
                this._selector[field] = 1;
            }
            else {
                Object.assign(this._selector, field);
            }
        }
        return this;
    }
    clone() {
        const cloned = new QueryBuilder(this.Model);
        return cloned;
    }
    async create(props) {
        const observer = this.Model.observer;
        const record = new this.Model(props);
        if (observer && observer.creating) {
            await observer.creating(record);
        }
        await record.save();
        if (observer && observer.created) {
            observer.created(record);
        }
    }
    delete() { }
    async paginate(page, limit = QueryBuilder.paginateSize) {
        const total = await this.Model.collection.countDocuments(this._query);
        const docs = await this.find(limit, (page - 1) * limit);
        const pages = Math.ceil(total / limit);
        return {
            limit,
            page,
            pages,
            total,
            docs,
        };
    }
}
exports.default = QueryBuilder;
QueryBuilder.paginateSize = 25;
