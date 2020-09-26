# Quick start

```js
import { Model, QueryBuilder } from "mongomodel";


class User extends Model {
    static collectionName = "users";
    static get query() {
        return new QueryBuilder(this);
    }

    get name() {
        return this.attributes.name;
    }
}

async function run() {
    const driver = await Model.connect("mongodb://127.0.0.1:27017", "yacs");
    const users = await User.query.find();
    console.log(users);
    // or
    for await (const user of User.query) {
        console.log(user.attributes.name);
    }

    // querying

    for await (const user of User.query.where(name, "Adil").take(10)) {
        const user.name // Adil
    }

    await driver.client.close();
}

run().catch(err => console.log(err));
```