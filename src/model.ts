import { Collection, MongoClientOptions } from "mongodb";
import Driver from "./driver";
import Observer from "./observer";

export interface ModelConstructor<X, Y extends Model<X>> {
    new (attributes: X): Y;
    collection: string;
    observer?: Observer<Y>;
    driver: Driver;
    getCollection(): Collection;
}

interface IDefaultProps {
    _id: string;
}

export default abstract class Model<P = Record<string, any>> {
    static collection: string;
    static driver: Driver;
    ['constructor']: typeof Model;

    static connect(url: string, database?: string, options?: MongoClientOptions) {
        const driver = new Driver(url, database, options);
        this.driver = driver;
        return driver.connect();
    }
    static getCollection() {
        console.log("collection name", this.collection);
        return this.driver.collection(this.collection);
    }

    static aggregate() {
        return this.getCollection().aggregate();
    }
    
    constructor(public readonly attributes: P & IDefaultProps) {}

    toJSON() {
        return this.attributes;
    }

    toObject() {
        return this.attributes;
    }

    async save() {
        if (this.attributes._id) {
            await this.constructor.getCollection().updateOne({
                _id: this.attributes._id
            }, this.attributes);
        } else {
            const record = await this.constructor.getCollection().insertOne(this.attributes);
            Object.assign(this.attributes, record);
        }
        return this;
    }
}
