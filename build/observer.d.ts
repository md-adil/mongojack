import Model from "./model";
export default abstract class Observer<T extends Model> {
    creating(record: T): void | Promise<void>;
    created(record: T): void | Promise<void>;
    updating(record: T, attributes: any): void | Promise<void>;
    updated(record: T, attributes: any): void | Promise<void>;
    deleting(record: T): void | Promise<void>;
    deleted(record: T): void | Promise<void>;
}
//# sourceMappingURL=observer.d.ts.map