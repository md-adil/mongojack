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
import { Model, QueryBuilder } from "mongojack";
interface Props {
    name: string;
}
class UserQueryBuilder extends QueryBuilder<User, Props> {
    male() {
        return this.where('gender', 'male');
    }
}
class User extends Model<Props> {
    static get query() {
        return new UserQueryBuilder(this);
    }
}

async function run() {
    const users = await User.query.male();
    for await (user of users) {
        console.log(user) // User (male)
    }

    User.query.push({roles: "admin"}) // push to array
    User.query.pull({roles: "admin"}) // pull
    User.query.increment({ session: 1 }) // increment
    User.query.multiply({do: 2}) // multiply
    User.query.unset(['name']) // unset fields
}
run().catch(err => console.log(err));
```

# Pagination
```js
import { Model, Pagination } from "mongojack";

Pagination.pageSize = 20 // default 25

const page = req.query.page || 1;
User.query.paginate(page).then(results => {
    console.log(results)
    // {
    // total: number;
    // limit: number;
    // page: number;
    // pages: number;
    // data: M[];
    // }
})

User.query.paginate(page, 10 /* override 20, 10 records per page */).then(results => {
    console.log(results)
    // {
        // total: number;
        // limit: number;
        // page: number;
        // pages: number;
        // data: M[];
    // }
})

const users = User.query.paginate(page);

const total = await users.total();
const pages = await users.pages();
const page = users.page
const data = await users.data();

for await (const user of users) {
    console.log(user); // User
}
const response = await users;
// {
    // total: number;
    // limit: number;
    // page: number;
    // pages: number;
    // data: M[];
// }
```