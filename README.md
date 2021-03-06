# Quick start
> Still being developed and highly unstable, please don't use it in production until major version release.

```js
import { Model, QueryBuilder } from "mongojack";


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
    const driver = await Model.connect("mongodb://127.0.0.1:27017", "hellodb");
    const users = await User.query.find();
    console.log(users);
    // or
    for await (const user of User.query) {
        console.log(user.attributes.name);
    }

    // querying

    for await (const user of User.query.where(name, "Adil").take(10)) {
        user.name // Adil
    }

    await driver.close();
}

run().catch(err => console.log(err));
```

See [Full documetation](https://md-adil.github.io/mongojack) here.

