"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Driver {
    constructor(uri, dbName, options) {
        this.dbName = dbName;
        if (typeof uri === "string") {
            this.client = new mongodb_1.MongoClient(uri, options);
        }
        else if (uri) {
            this.client = uri;
        }
    }
    get database() {
        return this.client?.db(this.dbName);
    }
    collection(name) {
        if (!this.database) {
            throw new Error("Database is not connected");
        }
        return this.database.collection(name);
    }
    async connect() {
        if (!this.client) {
            throw new Error("client is not set");
        }
        await this.client.connect();
        return this;
    }
    close() {
        if (!this.client) {
            return;
        }
        return this.client.close();
    }
}
exports.default = Driver;
