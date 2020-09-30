import { assert } from "chai";
import { any } from "joi";
import { ObjectID, ObjectId } from "mongodb";
import { defaultMaxListeners } from "stream";
import { Model, Observer, QueryBuilder } from "..";
import connection from "./connection";

describe("model", () => {
    let driver: any;
    before((done) => {
        Model.connect(...connection()).then((d) => {
            driver = d;
            done();
        });
    });

    after((done) => {
        driver.close().then(() => done());
    });
    describe("creating, updating, deleting and query", () => {
        interface IProps {
            _id: ObjectID;
            name: string;
        }
        class User extends Model<IProps> {
            static get query() {
                return new QueryBuilder(this);
            }
            get name() {
                return this.attributes.name;
            }
        }
        let createdId: any;
        it("Creating a record", async () => {
            const user = await User.query.create({
                name: "Adil",
            });
            assert.isFalse(user.isNew);
            assert.strictEqual(user.name, "Adil");
            createdId = user._id;
        });

        it("Find by id", async () => {
            const user = await User.query.findById(createdId);
            assert.deepEqual(user?.id, String(createdId));
        });

        it("Updating a record", async () => {
            const user = await User.query.findById(createdId);
            user!.attributes.name = "Hello";
            await user!.save();
            assert.deepEqual(
                (await User.query.findById(createdId))!.name,
                "Hello"
            );
        });
        it("Deleting a record", async () => {
            const user = await User.query.findById(createdId);
            await user!.delete();
            assert.isNull(await User.query.findById(createdId));
        });
        it("creating by instance", async () => {
            const user = new User({
                name: "Adil",
            });
            assert.isTrue(user.isNew);
            await user.save();
            assert.isFalse(user.isNew);
            assert.deepEqual(
                (await User.query.findById(user._id))!.id,
                user.id
            );
            await user.delete();
        });
    });

    describe("getters", () => {
        interface IProps {
            _id: ObjectID;
            name: string;
        }

        class User extends Model<IProps> {
            static hidden = ["_id"];
            static append = ["fullName"];
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
        it("_id should be instance of ObjectId", () => {
            assert.instanceOf(user._id, ObjectID);
        });
        it("id should be string of objectid", () => {
            assert.strictEqual(user.id, String(user._id));
        });
        it("toJSON should be equal to attribute", () => {
            assert.deepEqual(user.toJSON(), {
                fullName: "Adil",
                ...require("lodash").omit(user.attributes, ["_id"]),
            });
        });
        it("toObject should be equal to attribute", () => {
            assert.strictEqual(user.toObject(), user.attributes);
        });
    });

    describe("User with observer", () => {
        interface IUser {
            name: string;
        }

        class UserObserver extends Observer<User> {
            creating(user: User) {
                console.log("creating");
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
                const user = new User({ name: "Adil" }, false);
                await user.delete();
                assert(false, "Should not be deleted");
            } catch (err) {
                assert(err.message === "Could not delete", err.message);
            }
        });

        it("Could not create", async () => {
            try {
                const user = new User({ name: "Adil" });
                await user.save();
                assert(false, "Should not be created");
            } catch (err) {
                assert(err.message === "Could not create", err.message);
            }
        });
    });

    describe("Quering model", () => {
        interface IProps {
            name: string;
        }
        class User extends Model<IProps> {
            static collectionName = "users";
            static get query() {
                return new QueryBuilder(this);
            }
        }
        it("Shoud instance of query", () => {
            assert.instanceOf(User.query, QueryBuilder);
        });
        it("Query result be instance of User", async () => {
            const user = await User.query.first();
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

        it("Shoud gender male", () => {
            const q = User.query.male();
            assert.instanceOf(q, QueryBuilder);
            assert(q.query.gender === "male", "Gender should be male");
        });
    });
});
