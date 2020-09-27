import { Model, Observer, QueryBuilder } from "..";

interface IProps {
    name: string;
}

class UserObserver extends Observer<User, IProps> {
    creating() {
        console.log("creating");
    }

    created() {
        console.log("created");
    }
}

class UserQuery extends QueryBuilder<User, IProps> {
    latest() {
        return this.sort({createdAt: -1});
    }
}

class User extends Model<IProps> {
    static collectionName = "users";
    static get query() {
        return new UserQuery(this);
    }
    static get observer() {
        return new UserObserver();
    }
}

export default User;