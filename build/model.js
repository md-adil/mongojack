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
        this.isNew = isNew;
        this.hasObserve = true;
        this.attributes = attributes;
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
            presence: "required"
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
    noObserve() {
        this.hasObserve = false;
        return this;
    }
    async save() {
        if (!this.isNew) {
            return this.update(lodash_1.default.omit(this.attributes, this.constructor.primaryKeys));
        }
        const attributes = this.constructor.validateSchema(this.attributes);
        Object.assign(this.attributes, attributes);
        const observer = this.hasObserve && this.constructor.observer;
        if (observer && observer.creating) {
            console.log('trying to create');
            await observer.creating(this);
        }
        const record = await this.constructor.collection.insertOne(this.attributes);
        if (record.insertedId) {
            this.attributes[this.constructor.primaryKeys[0]] = record.insertedId;
        }
        if (observer && observer.created) {
            await observer.created(this);
        }
        return this;
    }
    get keyQuery() {
        return this.constructor.primaryKeys.reduce((val, key) => {
            val[key] = this.attributes[key];
            return val;
        }, {});
    }
    async update(attributes) {
        console.log("Saving", attributes);
        attributes = this.constructor.validateSchema(attributes, true);
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
