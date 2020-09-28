import { assert } from "chai";
import { Model, QueryBuilder } from "..";

describe("QueryBuilder", () => {
    class User extends Model<any> {
    }
    const queryBuilder = new QueryBuilder(User);
    describe("where", () => {
        it("should query has name Adil", () => {
            queryBuilder.where("name", "Adil").where({ $or: [ { name: "All" } ]})
            assert.deepEqual(queryBuilder.query as any, { "name": "Adil", $or: [{ name: "All" } ] });
        })
    });
    describe("limit & offset", () => {
        it("shoud has limit 10", () => {
            queryBuilder.take(10).skip(3);
            assert(queryBuilder.options.limit === 10, "Limit should be 10");
            assert(queryBuilder.options.skip === 3, "Offset should be 3");
        })
    })
});