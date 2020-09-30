import { Model, QueryBuilder, ValidationError } from "..";
import field from "joi";
import { assert } from "chai";
import connection from "./connection";

describe("Model with schema", () => {
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
    interface IUser {
        name: {
            first: string;
            last: string;
        }
    }

    class User extends Model<IUser> {
        static schema = {
            name: {
                first: field.string().required(),
                last: field.string()
            }
        }

        static get query() {
            return new QueryBuilder(this);
        }
    }
    describe("validateSchema", () => {
        it("it will be valid", () => {
            User.validateSchema({name: { first: "Adil", last: "Hello"}})
        });
        it("it will be invalid", () => {
            User.validateSchema(
                { name: { first: "Adil" }}, true
            )
        });
    });
    let lastUserId: any;
    describe("#create", () => {
        it("create with schema should fail", async () => {
            try {
                await User.query.create({ name: "Adil" } as any);
                assert(false, "Should not create record sinces validation error");
            } catch(err) {
                assert.instanceOf(err, ValidationError);
            }
        });

        it("create without schema should pass", async () => {
            const user = await User.query.noSchema().create({ name: "Adil" } as any);
            lastUserId = user._id;
            assert.equal(user.attributes.name as any, "Adil");
        });
    });
    describe("#update", () => {
        let user: User;
        it("update with schema should fail", async () => {
            user = (await User.query.findById(lastUserId))!;
            try {
                await user!.update({ name: "Hello" } as any)
                assert(false, "Should not create record sinces validation error");
            } catch(err) {
                assert.instanceOf(err, ValidationError);
            }
        });

        it("update without schema should pass", async () => {
            await user!.noSchema().update({ name: "Hello" } as any)
            assert.equal((user!.attributes as any).name, "Hello", "User not updated without schema");
            await user!.delete()
        });
    })
    describe("#createMany", () => {
        const allusers = [{
            name: "Apple",
        }, {
            name: "Mango"
        }]
        it("create many with schema should fail", async () => {
            try {
                await User.query.createMany(allusers as any);
                assert(false, "Should not create record sinces validation error");
            } catch(err) {
                assert.instanceOf(err, ValidationError);
            }
        });

        it("create many without schema should pass", async () => {
            const users = await User.query.noSchema().createMany(allusers as any);
            assert.equal(users[0].attributes.name as any, "Apple");
            for (const user of users) {
                await user.delete();
                console.log("deleted user", user.id);
            }
        });
    });
});
