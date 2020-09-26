# Quering data

```js
function run() {
    const users = await User.query.where('name', 'Adil').take(10).skip(5).find();
    console.log(users); // User[]
    // or use cursor instead.
    for await (const user of User.query.where('name', 'Adil').take(10).skip(5)) {
        console.log(user) // User
    }
}

run().catch(err => console.log(err));
```

# Custom query builder

```js
import { Model, QueryBuilder } from "mongomodel";

class UserQueryBuilder<M extends Model<P>, P> extends QueryBuilder<M, P> {
    male() {
        return this.where('gender', 'male');
    }
}
class User extends Model {
    get query() {
        return new UserQueryBuilder(this);
    }
}

async function run() {
    const users = await User.query.male();
    for await (user of users) {
        console.log(user) // User (male)
    }
}
run().catch(err => console.log(err));
```