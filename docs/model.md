# Define Model

```js
import { ObjectID } from "mongodb"
import { Model, QueryBuilder } from "mongojack"
interface IProps {
    _id: ObjectID;
    name: string;
}
class User extends Model<IProps> {
    static collectionName = "users"; // you can omit this property default collection name willbe used as class name User
    static get query() {
        return new QueryBuilder(this);
    }
}
```
# Default getters
```js
const user = User.query.first();
console.log(user.id) // string id
console.log(user._id) // ObjectID
console.log(user.toObject()) // user.attributes
console.log(user.toJSON()) // user.attributes 
```

# Create record
```js
User.query.create({name: "adil"}); // Promise<User>

const user = new User({name: "adil"});
user.save();

// without calling observer
User.query.noObserve().create({name: "adil"}); // Promise<User>
// or 
const user = new User({name: "adil"});
user.noObserve().save();
```

# Update record
```js
const user = await User.query.first();
user.attributes.name = "world";
await user.save();

// or
await user.update({name: "world"});
```

# Delete record
```js
    const user = User.query.where({name: "adil"}).first();
    await user.delete();
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