import { Collection, MongoClientOptions, ObjectID } from "mongodb";
import Driver from "./driver";
import Observer from "./observer";

export interface ModelConstructor<X, Y extends Model<X>> {
  new (attributes: X, isNew?: boolean): Y;
  collection: Collection;
  observer?: Observer<Y, X>;
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

  hasObserve = true;

  constructor(public readonly attributes: P, public readonly isNew = true) {}
  
  get id() {
    return String(this._id);
  }

  get _id() {
    return (this.attributes as any)._id as ObjectID;
  }

  noObserve() {
    this.hasObserve = false;
    return this;
  }
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
    const observer = this.hasObserve && this.constructor.observer;
    if (observer && observer.creating) {
      await observer.creating(this);
    }
      const record = await this.constructor.collection.insertOne(
        this.attributes
      );
      if (record.insertedId) {
        (this.attributes as any)[this.constructor.primaryKeys[0]] = record.insertedId
      }
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
    const observer = this.hasObserve && this.constructor.observer;
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
