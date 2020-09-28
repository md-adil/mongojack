import { Driver } from "..";

export class Collection {
    public queryCallback: any;
    onQuery(cb: any) {
        this.queryCallback = cb;
    }
    find(...args: any[]) {
        return this.queryCallback(...args);
    }
}
