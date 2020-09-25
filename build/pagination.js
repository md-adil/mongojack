"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pagination {
    constructor(queryBuilder) {
        this.queryBuilder = queryBuilder;
    }
    [Symbol.asyncIterator]() {
    }
    async total() {
    }
    async pages() {
    }
    toJSON() {
        return {
            limit: 0,
            page: 1,
            pages: 1,
            data: []
        };
    }
    async toObject() {
    }
    async data() {
    }
}
exports.default = Pagination;
