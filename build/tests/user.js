"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class UserObserver extends __1.Observer {
    creating() {
        console.log("creating");
    }
    created() {
        console.log("created");
    }
}
class UserQuery extends __1.QueryBuilder {
    latest() {
        return this.sort({ createdAt: -1 });
    }
}
class User extends __1.Model {
    static get query() {
        return new UserQuery(this);
    }
    static get observer() {
        return new UserObserver();
    }
}
User.collectionName = "users";
exports.default = User;
