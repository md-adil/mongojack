import { Collection, MongoClientOptions } from "mongodb";
import Driver from "./driver";
import Observer from "./observer";

export interface ModelConstructor<X, Y extends Model<X>> {
  new (attributes: X): Y;
  collection: Collection;
  observer: Observer<Y>;
}

interface IDefaultProps {
  _id: string;
}

export default abstract class Model<P = Record<string, any>> {
  static driver: Driver;
  ["constructor"]: typeof Model;

  static connect(url: string, database?: string, options?: MongoClientOptions) {
    const driver = new Driver(url, database, options);
    this.driver = driver;
    return driver.connect();
  }
  static get collection() {
    return this.driver.collection(this.name);
  }
  static aggregate() {
    return this.collection.aggregate();
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
      await this.constructor.collection.updateOne(
        {
          _id: this.attributes._id,
        },
        this.attributes
      );
    } else {
      const record = await this.constructor.collection.insertOne(
        this.attributes
      );
      Object.assign(this.attributes, record);
    }
    return this;
  }
}
