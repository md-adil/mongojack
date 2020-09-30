import { assert } from "chai";
import { Model, Observer, QueryBuilder } from "..";
import { wait } from "../utils/timer";
import connection from "./connection";

describe("Model with observer", () => {
    let driver: any;
    before((done) => {
        console.log("opening connection");
        Model.connect(...connection()).then((d) => {
            driver = d;
            console.log("Connection opened");
            done();
        });
    });

    after((done) => {
        console.log("closing connection");
        driver.close().then(() => done());
    });
    interface IProps {
        name: string;
    }
    
    class UserObserver extends Observer<User> {
        async creating(user: User) {
            await wait(1);
            if (user.attributes.name === "adil") {
                user.attributes.name = "hello";
            }
        }
    
        created(user: User) {
            if (user.attributes.name === "world") {
                user.attributes.name = "another world";
            }
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
    
    describe("#Before create", () => {
        it("Should have name hello of name adil", async () => {
            const user = await User.query.create({name: "adil"});
            assert.equal(user.attributes.name, "hello");
            await user.delete();
        })
        it("Without observer creating user name should be as it is", async () => {
            const user = await User.query.noObserver().create({name: "adil"});
            assert.equal(user.attributes.name, "adil");
            await user.delete();
        });
    })
    describe("#After create", () => {
        it("should another world of world", async() => {
            const user = await User.query.create({ name: "world" });
            assert.equal(user.attributes.name, "another world");
            await user.delete();
        })
        it("without observer name should match exact", async() => {
            const user = await User.query.noObserver().create({ name: "world" });
            assert.equal(user.attributes.name, "world");
            await user.delete();
        });
    })
});