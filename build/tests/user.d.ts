import { Model, Observer, QueryBuilder } from "..";
interface IProps {
    name: string;
}
declare class UserObserver extends Observer<User> {
    creating(): void;
    created(): void;
}
declare class User extends Model<IProps> {
    static collectionName: string;
    static get query(): QueryBuilder<User, IProps>;
    static get observer(): UserObserver;
    get name(): string;
}
export default User;
//# sourceMappingURL=user.d.ts.map