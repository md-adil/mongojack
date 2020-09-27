# Driver

```js
export default class Driver {
    dbName?: string | undefined;
    client?: MongoClient;
    constructor(uri?: string | MongoClient, dbName?: string | undefined, options?: MongoClientOptions);
    get database(): Db | undefined;
    collection(name: string): import("mongodb").Collection<any>;
    connect(): Promise<this>;
    close(): Promise<void> | undefined;
}
```

# Model
```js
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
export default abstract class Observer<T extends Model> {
    creating(record: T): void | Promise<void>;
    created(record: T): void | Promise<void>;
    deleting(record: T): void | Promise<void>;
    deleted(record: T): void | Promise<void>;
}
```

# Query
```js
export default class QueryBuilder<M extends Model<P>, P> {
    Model: ModelConstructor<P, M>;
    protected _query: Record<string, string | number>;
    protected _options: FindOneOptions<P>;
    static pageSize: number;
    constructor(Model: ModelConstructor<P, M>);
    find(): Promise<M[]>;
    first(): Promise<M | null>;
    take(n: FindOneOptions<P>["limit"]): this;
    skip(n: FindOneOptions<P>["skip"]): this;
    sort(n: FindOneOptions<P>["sort"]): this;
    where(name: string, value: any): this;
    project(p: FindOneOptions<P>["projection"]): void;
    clone(): QueryBuilder<M, P>;
    create(props: Omit<P, "_id">): Promise<M>;
    delete(): void;
    modelify(data: AsyncGenerator<P> | Cursor<P>): Promise<M[]>;
    count(): Promise<number>;
    paginate(page: number, limit?: number): Pagination<M, P>;
    paginateRaw(page: number, limit?: number): Promise<{
        limit: number;
        page: number;
        pages: number;
        total: number;
        docs: M[];
    }>;
    [Symbol.asyncIterator](): AsyncGenerator<M, void, unknown>;
}
interface IResult<M> {
    total: number;
    limit: number;
    page: number;
    pages: number;
    data: M[];
}
declare class Pagination<M extends Model<P>, P> {
    readonly queryBuilder: QueryBuilder<M, P>;
    readonly page: number;
    readonly limit: number;
    static pageSize: number;
    _total?: number;
    _rows?: M[];
    constructor(queryBuilder: QueryBuilder<M, P>, page: number, limit?: number);
    total(): Promise<number>;
    get offset(): number;
    pages(): Promise<number>;
    then(callback: (result: IResult<M>) => void | Promise<any>): Promise<void>;
    catch(callback: (err: Error) => void | Promise<any>): Promise<any>;
    toJSON(): void;
    toObject(): Promise<IResult<M>>;
    data(): Promise<M[]>;
    [Symbol.asyncIterator](): AsyncGenerator<M, void, unknown>;
}
```
# Error
```js
export declare class Error extends MongoError {
    type: string;
}
export declare class ConnectionError extends Error {
}
export declare class ValidationError extends Error {
}

```