# Define Model

```js
import { ObjectID } from "mongodb"
import { Model, QueryBuilder } from "mongomodel"
interface IProps {
    _id: ObjectID;
    name: string;
}

class User extends Model<IProps> {
    static collectionName = "users";
    static get query() {
        return new QueryBuilder(this);
    }
}
```

# Query database
```js
async function run() {
    const user = await User.query.where("name", "Adil").first();
    if (!user) {
        console.log("User not found");
    }

    user.attributes.name // "Adil"
}
run().catch(err => console.log(err));
```

# Getters & Setters
```js
class User extends ... {
    ...
    get name() {
        return this.attributes.name;
    }
}
```