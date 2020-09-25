import { Collection, MongoClientOptions, ObjectID } from "mongodb";
import Driver from "./driver";
import Observer from "./observer";
export interface ModelConstructor<X, Y extends Model<X>> {
    new (attributes: X): Y;
    collection: Collection;
    observer?: Observer<Y>;
}
interface IDefaultProps {
    _id: ObjectID;
}
export default abstract class Model<P = Record<string, any>> {
    readonly attributes: P & IDefaultProps;
    static collectionName: string;
    static driver: Driver;
    ["constructor"]: typeof Model;
    static connect(url: string, database?: string, options?: MongoClientOptions): Promise<Driver>;
    static get collection(): Collection<any>;
    static aggregate(): import("mongodb").AggregationCursor<any>;
    constructor(attributes: P & IDefaultProps);
    toJSON(): P & IDefaultProps;
    toObject(): P & IDefaultProps;
    save(): Promise<this>;
}
export {};
//# sourceMappingURL=model.d.ts.map