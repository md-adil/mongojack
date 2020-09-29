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
const collection = User.collection; // mongodb native collection.
collection.findOne({_id: ObjectId('someid')}).then((result) => {
    console.log(result) // result object
})
const user = User.query.first();
console.log(user.id) // string id
console.log(user._id) // ObjectID
console.log(user.toObject()) // user.attributes
console.log(user.toJSON()) // user.attributes 
```
# Schema

```js
import { Model, schema } from "mongojack";
class User extends Model {
    static schema: {
        name: schema.string().optional().default("Hello"),
        phone: schema.number().min(10).max(10)
    }
}

// default all fields are required, you have to explicitly make field optional by calling optional property
// we are using joi schema underneath, please check full list of validation
// https://joi.dev/api
```

# Append field
```js
class User extends Model {
    static append = ['fullname'];
    fullname() {
        return this.attributes.firstname + " " this.attributes.lastname;
    }
}

const user = new User({ firstname: "Hello", lastname: "world" });

user.toJSON() // {"firstname": "Hello", "lastname": "world", "fullname": "Hello world"}

```

# Hidden field
```js
class User extends Model {
    static hidden = ['password'];
}

const user = new User({name: "Hello", password: "asbc"});
user.toJSON() // {"name": "Hello" }
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
    // or
    await User.query.where({ name: "Adil" }).delete(); // delete all records containing name adil
    // or using native driver
    await User.collection.deleteMany({name: "Adil"});

```


# Query database
```js
async function run() {
    const user = await User.query.where("name", "Adil").first();
    if (!user) {
        console.log("User not found");
    }

    user.attributes.name; // "Adil"

    // Alway use native driver
    const users: any[] = await User.collection.find({name: "Adil"}).toArray();
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