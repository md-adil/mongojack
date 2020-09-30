import Joi from "joi";
import { Collection, MongoClientOptions, ObjectID } from "mongodb";
import Driver from "./driver";
import Observer from "./observer";
import { ValidationError } from "./error";
import _ from "lodash";

export interface ModelConstructor<M extends Model<P>, P> {
    new (attributes: P, isNew?: boolean): M;
    primaryKeys: string[];
    collection: Collection;
    driver: Driver;
    collectionName?: string;
    observer?: Observer;
    hidden: string[];
    append: string[];
    validateSchema(attributes: any, isUpdate?: boolean): any;
}

export default abstract class Model<P = Record<string, any>> {
    static driver: Driver;
    static collectionName: string;
    static primaryKeys = ["_id"];
    static observer?: Observer;
    static schema?: Record<string, any> | Joi.AnySchema;
    static hidden: string[] = [];
    static append: string[] = [];

    ["constructor"]: typeof Model;

    static connect(
        url: string,
        database?: string,
        options?: MongoClientOptions
    ) {
        const driver = new Driver(url, database, options);
        this.driver = driver;
        return driver.connect();
    }

    static validateSchema(values: any, isUpdate = false) {
        let schema = this.schema;
        if (!schema) {
            return values;
        }
        let options: Joi.ValidationOptions = {
            presence: "required",
        };
        if (isUpdate) {
            options.presence = "optional";
            options.noDefaults = true;
        }
        const data = Joi.compile(schema!).validate(values, options);
        if (data.error) {
            throw new ValidationError(data.error.message);
        }
        return data.value;
    }

    static get collection() {
        if (!this.driver || !this.driver.collection) {
            throw new Error("Database not connected accessing collection: " + (this.collectionName || this.name));
        }
        return this.driver.collection(this.collectionName || this.name);
    }

    static aggregate() {
        return this.collection.aggregate();
    }

    protected hasObserver = true;
    protected hasSchema = true;
    constructor(public readonly attributes: P, public isNew = true) {}

    get id() {
        return String(this._id);
    }

    get _id() {
        return (this.attributes as any)._id as ObjectID;
    }

    noObserver() {
        this.hasObserver = false;
        return this;
    }

    public noSchema() {
        this.hasSchema = false;
        return this;
    }

    async save() {
        if (!this.isNew) {
            return this.update(
                _.omit(
                    this.attributes as any,
                    this.constructor.primaryKeys
                ) as any
            );
        }
        if (this.hasSchema) {
            Object.assign(
                this.attributes,
                this.constructor.validateSchema(this.attributes)
            );
        }
        const observer = this.hasObserver && this.constructor.observer;
        if (observer && observer.creating) {
            await observer.creating(this);
        }
        const record = await this.constructor.collection.insertOne(
            this.attributes
        );

        if (record.insertedId) {
            (this.attributes as any)[this.constructor.primaryKeys[0]] =
                record.insertedId;
        }
        this.isNew = false;
        if (observer && observer.created) {
            observer.created(this);
        }
        return this;
    }

    get keyQuery() {
        return this.constructor.primaryKeys.reduce((val, key) => {
            (val as any)[key] = (this.attributes as any)[key];
            return val;
        }, {});
    }

    async unset(fields: string[]) {
        const values = fields.reduce<Record<string, any>>((r, k) => {
            r[k] = true;
            return r;
        }, {});
        await this.constructor.collection.updateOne(this.keyQuery, {
            $unset: values,
        });
        fields.forEach((f) => {
            delete (this.attributes as any)[f];
        });
        return this;
    }

    async update(attributes: Partial<P>) {
        if (this.hasSchema) {
            this.constructor.validateSchema(attributes, true);
        }
        const observer = this.hasObserver && this.constructor.observer;
        if (observer && observer.updating) {
            await observer.updating(this, attributes);
        }
        await this.constructor.collection.updateOne(this.keyQuery, {
            $set: attributes,
        });
        Object.assign(this.attributes, attributes);
        if (observer && observer.updated) {
            observer.updated(this, attributes);
        }
        return this;
    }
    async delete() {
        const observer = this.hasObserver && this.constructor.observer;
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
        let attributes: any = this.attributes;
        if (this.constructor.hidden.length) {
            attributes = _.omit(attributes, this.constructor.hidden);
        }
        if (this.constructor.append) {
            _.extend(attributes, _.pick(this, this.constructor.append));
        }
        return attributes;
    }

    toObject() {
        return this.attributes;
    }
}
