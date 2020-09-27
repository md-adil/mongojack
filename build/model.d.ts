import { Collection, MongoClientOptions, ObjectID } from "mongodb";
import Driver from "./driver";
import Observer from "./observer";
export interface ModelConstructor<M extends Model<P>, P> {
    new (attributes: P, isNew?: boolean): M;
    collection: Collection;
    observer?: Observer<M, P>;
}
export default abstract class Model<P = Record<string, any>> {
    readonly attributes: P;
    readonly isNew: boolean;
    static collectionName: string;
    static driver: Driver;
    static primaryKeys: string[];
    static observer?: Observer<Model, Record<string, any>>;
    ["constructor"]: typeof Model;
    static connect(url: string, database?: string, options?: MongoClientOptions): Promise<Driver>;
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
    toJSON(): P;
    toObject(): P;
}
//# sourceMappingURL=model.d.ts.map