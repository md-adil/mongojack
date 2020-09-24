import Model from "./model";
export default abstract class Observer<T extends Model> {
    creating(record: T): void | Promise<void>;
    created(record: T): void | Promise<void>;
    deleting(record: T): void | Promise<void>;
    deleted(record: T): void | Promise<void>;
}
//# sourceMappingURL=observer.d.ts.map