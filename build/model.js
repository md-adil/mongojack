"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const driver_1 = __importDefault(require("./driver"));
const error_1 = require("./error");
const lodash_1 = __importDefault(require("lodash"));
class Model {
    constructor(attributes, isNew = true) {
        this.attributes = attributes;
        this.isNew = isNew;
        this.hasObserver = true;
        this.hasSchema = true;
    }
    static connect(url, database, options) {
        const driver = new driver_1.default(url, database, options);
        this.driver = driver;
        return driver.connect();
    }
    static validateSchema(values, isUpdate = false) {
        let schema = this.schema;
        if (!schema) {
            return values;
        }
        let options = {
            presence: "required",
        };
        if (isUpdate) {
            options.presence = "optional";
            options.noDefaults = true;
        }
        const data = joi_1.default.compile(schema).validate(values, options);
        if (data.error) {
            throw new error_1.ValidationError(data.error.message);
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
    get id() {
        return String(this._id);
    }
    get _id() {
        return this.attributes._id;
    }
    noObserver() {
        this.hasObserver = false;
        return this;
    }
    noSchema() {
        this.hasSchema = false;
        return this;
    }
    async save() {
        if (!this.isNew) {
            return this.update(lodash_1.default.omit(this.attributes, this.constructor.primaryKeys));
        }
        if (this.hasSchema) {
            Object.assign(this.attributes, this.constructor.validateSchema(this.attributes));
        }
        const observer = this.hasObserver && this.constructor.observer;
        if (observer && observer.creating) {
            await observer.creating(this);
        }
        const record = await this.constructor.collection.insertOne(this.attributes);
        if (record.insertedId) {
            this.attributes[this.constructor.primaryKeys[0]] =
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
            val[key] = this.attributes[key];
            return val;
        }, {});
    }
    async unset(fields) {
        const values = fields.reduce((r, k) => {
            r[k] = true;
            return r;
        }, {});
        await this.constructor.collection.updateOne(this.keyQuery, {
            $unset: values,
        });
        fields.forEach((f) => {
            delete this.attributes[f];
        });
        return this;
    }
    async update(attributes) {
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
        let attributes = this.attributes;
        if (this.constructor.hidden.length) {
            attributes = lodash_1.default.omit(attributes, this.constructor.hidden);
        }
        if (this.constructor.append) {
            lodash_1.default.extend(attributes, lodash_1.default.pick(this, this.constructor.append));
        }
        return attributes;
    }
    toObject() {
        return this.attributes;
    }
}
exports.default = Model;
Model.primaryKeys = ["_id"];
Model.hidden = [];
Model.append = [];
