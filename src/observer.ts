import Model from "./model";

export default abstract class Observer<T extends Model<P>, P> {
    creating(record: T): void | Promise<void> {

    }

    created(record: T): void | Promise<void> {

    }
    
    updating(record: T, attributes: Partial<P>): void | Promise<void> {

    }

    updated(record: T, attributes: Partial<P>): void | Promise<void> {

    }

    deleting(record: T): void | Promise<void> {

    }

    deleted(record: T): void | Promise<void> {

    }
}