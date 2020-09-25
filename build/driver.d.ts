import { Db, MongoClient, MongoClientOptions } from "mongodb";
export default class Driver {
    dbName?: string | undefined;
    client?: MongoClient;
    constructor(uri?: string | MongoClient, dbName?: string | undefined, options?: MongoClientOptions);
    get database(): Db | undefined;
    collection(name: string): import("mongodb").Collection<any>;
    connect(): Promise<this>;
    close(): Promise<void> | undefined;
}
//# sourceMappingURL=driver.d.ts.map