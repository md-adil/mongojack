import { Model, QueryBuilder } from "..";

interface IProps {
    name: string;
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
}

export default User;