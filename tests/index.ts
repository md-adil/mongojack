import { Model, QueryBuilder } from "../src";


class User extends Model {
    static collection = "users";
    static get query() {
        return new QueryBuilder(this);
    }
}

async function run() {
    const driver = await Model.connect("mongodb://127.0.0.1:27017", "yacs");
    const users = await User.query.find();
    await driver.client.close();
}

run().catch(err => console.log(err));