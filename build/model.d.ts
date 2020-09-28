import Joi from "joi";
import { Collection, MongoClientOptions, ObjectID } from "mongodb";
import Driver from "./driver";
import Observer from "./observer";
export interface ModelConstructor<M extends Model<P>, P> {
    new (attributes: P, isNew?: boolean): M;
    collection: Collection;
    driver: Driver;
    collectionName?: string;
    observer?: Observer<M>;
    validateSchema(attributes: any, fields?: string[]): any;
}
export default abstract class Model<P = Record<string, any>> {
    readonly attributes: P;
    readonly isNew: boolean;
    static collectionName: string;
    static driver: Driver;
    static primaryKeys: string[];
    static observer?: Observer<any>;
    static schema?: Record<string, Joi.Schema>;
    static hidden: string[];
    static append: string[];
    ["constructor"]: typeof Model;
    static connect(url: string, database?: string, options?: MongoClientOptions): Promise<Driver>;
    static validateSchema(values: any, fields?: string[]): any;
    static get collection(): Collection<any>;
    static aggregate(): import("mongodb").AggregationCursor<any>;
    hasObserve: boolean;
    constructor(attributes: P, isNew?: boolean);
    get id(): string;
    get _id(): ObjectID;
    noObserve(): this;
    save(): Promise<this>;
    get keyQuery(): {};
    update(attributes: Partial<P>): Promise<this>;
    delete(): Promise<this>;
    toJSON(): any;
    toObject(): P;
}
//# sourceMappingURL=model.d.ts.map