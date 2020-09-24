import { Db, MongoClient, MongoClientOptions } from "mongodb";
export default class Driver {
    dbName?: string | undefined;
    client: MongoClient;
    database?: Db;
    constructor(uri: string | MongoClient, dbName?: string | undefined, options?: MongoClientOptions);
    collection(name: string): import("mongodb").Collection<any>;
    connect(): Promise<this>;
}
//# sourceMappingURL=driver.d.ts.map