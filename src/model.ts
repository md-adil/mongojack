import { Collection, MongoClientOptions, ObjectID } from "mongodb";
import Driver from "./driver";
import Observer from "./observer";

export interface ModelConstructor<X, Y extends Model<X>> {
  new (attributes: X, isNew?: boolean): Y;
  collection: Collection;
  observer?: Observer<Y, X>;
}

interface IDefaultProps {
  _id: ObjectID;
}

export default abstract class Model<P = Record<string, any>> {
  static collectionName: string;
  static driver: Driver;
  static primaryKeys = ["_id"];
  static observer?: Observer<Model, Record<string, any>>;
  ["constructor"]: typeof Model;

  static connect(url: string, database?: string, options?: MongoClientOptions) {
    const driver = new Driver(url, database, options);
    this.driver = driver;
    return driver.connect();
  }

  static get collection() {
    return this.driver.collection(this.collectionName || this.name);
  }

  static aggregate() {
    return this.collection.aggregate();
  }

  constructor(public readonly attributes: P & IDefaultProps, public readonly isNew = true) {}

  toJSON() {
    return this.attributes;
  }

  toObject() {
    return this.attributes;
  }

  async save() {
    if (!this.isNew) {
      return this.update(this.attributes);
    }
    const observer = this.constructor.observer;
    if (observer && observer.creating) {
      await observer.creating(this);
    }
      const record = await this.constructor.collection.insertOne(
        this.attributes
      );
      this.attributes._id = record.insertedId
      if (observer && observer.created) {
        await observer.creating(this);
      }
    return this;
  }

  get keyQuery() {
    return this.constructor.primaryKeys.reduce((val, key) => {
        (val as any)[key] = (this.attributes as any)[key];
        return val;
    }, {});
  }

  async update(attributes: Partial<P>) {
    const observer = this.constructor.observer;
    if (observer && observer.updating) {
      await observer.updating(this, attributes);
    }
    await this.constructor.collection.updateOne(this.keyQuery, attributes);
    if (observer && observer.updated) {
      observer.updated(this, attributes);
    }
    return this;
  }
}
