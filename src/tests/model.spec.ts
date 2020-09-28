import { assert, should } from "chai";
import { ObjectID, ObjectId } from "mongodb";
import { Model, Observer, QueryBuilder } from "..";
import { Collection } from "./connection";

describe("User", () => {
    describe("Define model", () => {
        interface IProps {
            _id: ObjectID;
            name: string;
        }
    
        class User extends Model<IProps> {
            get name() {
                return this.attributes.name;
            }
        }
        const user = new User({name: "Adil", _id: new ObjectId()}, false);
    });
    describe("getters", () => {
        interface IProps {
            _id: ObjectID;
            name: string;
        }
    
        class User extends Model<IProps> {
            static hidden = ['_id'];
            static append = ['fullName'];
            get name() {
                return this.attributes.name;
            }
            get fullName() {
                return this.attributes.name;
            }
        }
        const user = new User({ name: "Adil", _id: new ObjectId() }, false);
        it("name", () => {
            assert.strictEqual(user.name, "Adil", "User name should be Adil");
        });
        it ("_id should be instance of ObjectId", () => {
            assert.instanceOf(user._id, ObjectID);
        })
        it ("id should be string of objectid", () => {
            assert.strictEqual(user.id, String(user._id));
        });
        it("toJSON should be equal to attribute", () => {
            assert.deepEqual(user.toJSON(), {fullName: "Adil", ...require('lodash').omit(user.attributes, ['_id']) });
        })
        it("toObject should be equal to attribute", () => {
            assert.strictEqual(user.toObject(), user.attributes);
        })
    });

    describe("User with observer", () => {
        interface IUser {
            name: string;
        }

        class UserObserver extends Observer<User> {
            creating(user: User) {
                console.log("creating")
                throw new Error("Could not create");
            }

            deleting() {
                throw new Error("Could not delete");
            }
        }
        class User extends Model<IUser> {
            static get observer() {
                return new UserObserver();
            }
        }

        it("Could not delete", async () => {
            try {
                const user = new User({name: "Adil"}, false);
                await user.delete();
                assert(false, "Should not be deleted");
            } catch(err) {
                assert(err.message === "Could not delete", err.message);
            }
        })

        it("Could not create", async () => {
            try {
                const user = new User({ name: "Adil" });
                await user.save();
                assert(false, "Should not be created");
            } catch(err) {
                assert(err.message === "Could not create", err.message);
            }
        });
        
    });

    describe("Quering model", () => {
        class User extends Model<any> {
            static get query() {
                return new QueryBuilder(this);
            }
        }

        it ("Shoud instance of query", () => {
            assert.instanceOf(User.query, QueryBuilder);
        });
    });

    describe("Custom Qyery", () => {
        class UserQuery extends QueryBuilder<User, any> {
            male() {
                return this.where("gender", "male");
            }
        }
        class User extends Model<any> {
            static get query() {
                return new UserQuery(this);
            }
        }

        it ("Shoud gender male", () => {
            const q = User.query.male();
            assert.instanceOf(q, QueryBuilder);
            assert(q.query.gender === "male", "Gender should be male");
        });
    });
});
