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
class User extends __1.Model {
    static get query() {
        return new __1.QueryBuilder(this);
    }
    static get observer() {
        return new UserObserver();
    }
    get name() {
        return this.attributes.name;
    }
}
User.collectionName = "users";
exports.default = User;
