"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Driver {
    constructor(uri, dbName, options) {
        this.dbName = dbName;
        if (typeof uri === "string") {
            this.client = new mongodb_1.MongoClient(uri, options);
        }
        else {
            this.client = uri;
        }
    }
    collection(name) {
        if (!this.database) {
            throw new Error("Database is not connected");
        }
        return this.database.collection(name);
    }
    async connect() {
        await this.client.connect();
        this.database = this.client.db(this.dbName);
        return this;
    }
}
exports.default = Driver;
