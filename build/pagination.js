"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pagination {
    constructor(queryBuilder, page, limit = Pagination.pageSize) {
        this.queryBuilder = queryBuilder;
        this.page = page;
        this.limit = limit;
    }
    async total() {
        if (this._total === undefined) {
            this._total = await this.queryBuilder.count();
        }
        return this._total;
    }
    get offset() {
        return (this.page - 1) * this.limit;
    }
    async pages() {
        return Math.ceil(await this.total() / this.limit);
    }
    async then(callback) {
        callback(await this.toObject());
    }
    catch(callback) {
        return this.toObject().catch(callback);
    }
    toJSON() {
    }
    async toObject() {
        return {
            total: await this.total(),
            limit: this.limit,
            page: this.page,
            pages: await this.pages(),
            data: await this.data()
        };
    }
    async data() {
        if (this._rows === undefined) {
            this._rows = await this.queryBuilder.take(this.limit).skip(this.offset).find();
        }
        return this._rows;
    }
    async *[Symbol.asyncIterator]() {
        if (this._rows) {
            for (const row of this._rows) {
                yield row;
            }
            return;
        }
        const rows = [];
        for await (const row of this.queryBuilder.take(this.limit).skip(this.offset)) {
            rows.push(row);
            yield row;
        }
        this._rows = rows;
    }
}
Pagination.pageSize = 25;
exports.default = Pagination;
