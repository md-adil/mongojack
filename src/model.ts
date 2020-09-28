import Joi from "joi";
import { Collection, MongoClientOptions, ObjectID } from "mongodb";
import Driver from "./driver";
import Observer from "./observer";
import { ValidationError } from "./error";
import _ from "lodash";

export interface ModelConstructor<M extends Model<P>, P> {
  new (attributes: P, isNew?: boolean): M;
  collection: Collection;
  driver: Driver;
  collectionName?: string;
  observer?: Observer<M>;
  validateSchema(attributes: any, fields?: string[]): any;
}

export default abstract class Model<P = Record<string, any>> {
  static collectionName: string;
  static driver: Driver;
  static primaryKeys = ["_id"];
  static observer?: Observer<any>;
  static schema?: Record<string, Joi.Schema>;
  ["constructor"]: typeof Model;
  
  static connect(url: string, database?: string, options?: MongoClientOptions) {
    const driver = new Driver(url, database, options);
    this.driver = driver;
    return driver.connect();
  }

  static validateSchema(values: any, fields?: string[]) {
    let schema = this.schema;
    if (schema) {
      return values;
    }
    if (fields) {
      schema = _.pick(schema, fields);
    }
    const data = Joi.object(schema).validate(values);
    if (data.error) {
      throw new ValidationError(data.error.message);
    }
    return data.value;
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
  
  async save() {
    if (!this.isNew) {
      return this.update(this.attributes);
    }
    const attributes = this.constructor.validateSchema(this.attributes);
    Object.assign(this.attributes, attributes);
    const observer = this.hasObserve && this.constructor.observer;
    if (observer && observer.creating) {
      console.log('trying to create');
      await observer.creating(this);
    }
      const record = await this.constructor.collection.insertOne(
        this.attributes
      );
      if (record.insertedId) {
        (this.attributes as any)[this.constructor.primaryKeys[0]] = record.insertedId
      }
      if (observer && observer.created) {
        await observer.created(this);
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
    attributes = this.constructor.validateSchema(attributes, Object.keys(attributes));
    const observer = this.hasObserve && this.constructor.observer;
    Object.assign(this.attributes, attributes);
    if (observer && observer.updating) {
      await observer.updating(this, attributes);
    }
    await this.constructor.collection.updateOne(this.keyQuery, { $set: attributes });
    if (observer && observer.updated) {
      observer.updated(this, attributes);
    }
    return this;
  }
  async delete() {
    const observer = this.hasObserve && this.constructor.observer;
    if (observer && observer.deleting) {
      await observer.deleting(this);
    }
    await this.constructor.collection.deleteOne(this.keyQuery);
    if (observer && observer.deleted) {
      await observer.deleted(this);
    }
    return this;
  }
  toJSON() {
    return this.attributes;
  }

  toObject() {
    return this.attributes;
  }
}
