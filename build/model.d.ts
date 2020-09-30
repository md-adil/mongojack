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
    validateSchema(attributes: any, isUpdate?: boolean): any;
}
export default abstract class Model<P = Record<string, any>> {
    readonly isNew: boolean;
    static collectionName: string;
    static driver: Driver;
    static primaryKeys: string[];
    static observer?: Observer<any>;
    static schema?: Record<string, any> | Joi.AnySchema;
    static hidden: string[];
    static append: string[];
    ["constructor"]: typeof Model;
    static connect(url: string, database?: string, options?: MongoClientOptions): Promise<Driver>;
    static validateSchema(values: any, isUpdate?: boolean): any;
    static get collection(): Collection<any>;
    static aggregate(): import("mongodb").AggregationCursor<any>;
    hasObserve: boolean;
    readonly attributes: P;
    constructor(attributes: Partial<P>, isNew?: boolean);
    get id(): string;
    get _id(): ObjectID;
    noObserve(): this;
    save(): Promise<this>;
    get keyQuery(): {};
    unset(fields: string[]): Promise<this>;
    update(attributes: Partial<P>): Promise<this>;
    delete(): Promise<this>;
    toJSON(): any;
    toObject(): P;
}
//# sourceMappingURL=model.d.ts.map