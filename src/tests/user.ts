import { Model, Observer, QueryBuilder } from "..";

interface IProps {
    name: string;
}

class UserObserver extends Observer<User> {
    creating() {
        console.log("creating");
    }

    created() {
        console.log("created");
    }
}

class User extends Model<IProps> {
    static collectionName = "users";
    static get query() {
        return new QueryBuilder(this);
    }

    static get observer() {
        return new UserObserver();
    }

    get name() {
        return this.attributes.name;
    }
}

export default User;