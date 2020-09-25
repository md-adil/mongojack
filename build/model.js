"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = __importDefault(require("./driver"));
class Model {
    constructor(attributes) {
        this.attributes = attributes;
    }
    static connect(url, database, options) {
        const driver = new driver_1.default(url, database, options);
        this.driver = driver;
        return driver.connect();
    }
    static get collection() {
        return this.driver.collection(this.collectionName || this.name);
    }
    static aggregate() {
        return this.collection.aggregate();
    }
    toJSON() {
        return this.attributes;
    }
    toObject() {
        return this.attributes;
    }
    async save() {
        if (this.attributes._id) {
            await this.constructor.collection.updateOne({
                _id: this.attributes._id,
            }, this.attributes);
        }
        else {
            const record = await this.constructor.collection.insertOne(this.attributes);
            this.attributes._id = record.insertedId;
        }
        return this;
    }
}
exports.default = Model;
