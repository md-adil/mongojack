import { Model, Observer, QueryBuilder } from "..";
interface IProps {
    name: string;
}
declare class UserObserver extends Observer<User, IProps> {
    creating(): void;
    created(): void;
}
declare class UserQuery extends QueryBuilder<User, IProps> {
    latest(): this;
}
declare class User extends Model<IProps> {
    static collectionName: string;
    static get query(): UserQuery;
    static get observer(): UserObserver;
}
export default User;
//# sourceMappingURL=user.d.ts.map