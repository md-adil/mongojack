import Joi from "joi";
import { Collection, MongoClientOptions, ObjectID } from "mongodb";
import Driver from "./driver";
import Observer from "./observer";
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
    readonly attributes: P;
    isNew: boolean;
    static driver: Driver;
    static collectionName: string;
    static primaryKeys: string[];
    static observer?: Observer;
    static schema?: Record<string, any> | Joi.AnySchema;
    static hidden: string[];
    static append: string[];
    ["constructor"]: typeof Model;
    static connect(url: string, database?: string, options?: MongoClientOptions): Promise<Driver>;
    static validateSchema(values: any, isUpdate?: boolean): any;
    static get collection(): Collection<any>;
    static aggregate(): import("mongodb").AggregationCursor<any>;
    protected hasObserver: boolean;
    protected hasSchema: boolean;
    constructor(attributes: P, isNew?: boolean);
    get id(): string;
    get _id(): ObjectID;
    noObserver(): this;
    noSchema(): this;
    save(): Promise<this>;
    get keyQuery(): {};
    unset(fields: string[]): Promise<this>;
    update(attributes: Partial<P>): Promise<this>;
    delete(): Promise<this>;
    toJSON(): any;
    toObject(): P;
}
//# sourceMappingURL=model.d.ts.map