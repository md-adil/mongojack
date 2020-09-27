# Change events

```js
import { Mode, Observer } from "mongojack"

class UserObserver extends Observer<User> {
    async creating(user: User) {
        // creating
        // change something
        if (user.attributes.password) {
            user.attributes.password = bcrypt(user.attributes.password);
        }
        // or do some async stuff just using await
    }

    created() {

    }

    updating() {

    }

    updated() {

    }

    deleting() {

    }

    deleted() {
        // implement your own stuff;
    }
}

class User extends Model {
    ...
    static get observer() {
        return new Observer();
    }
}

