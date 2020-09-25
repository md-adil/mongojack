import { Db, MongoClient, MongoClientOptions } from "mongodb";
import { Error } from "./error";

export default class Driver {
    client?: MongoClient;
    constructor(uri?: string | MongoClient, public dbName?: string, options?: MongoClientOptions) {
        if (typeof uri === "string") {
            this.client = new MongoClient(uri, options);
        } else if (uri) {
            this.client = uri;
        }
    }

    get database() {
        return this.client?.db(this.dbName);
    }

    collection(name: string) {
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
        return this.client.close()
    }
}
