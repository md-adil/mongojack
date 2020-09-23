import { Db, MongoClient, MongoClientOptions } from "mongodb";

export default class Driver {
    client: MongoClient;
    database?: Db;
    constructor(uri: string | MongoClient, public dbName?: string, options?: MongoClientOptions) {
        if (typeof uri === "string") {
            this.client = new MongoClient(uri, options);
        } else {
            this.client = uri;
        }
    }
    collection(name: string) {
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
