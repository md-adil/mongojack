import { Model } from "..";
import field from "joi";

describe("Schema", () => {
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
    }
    describe("validateSchema", () => {
        it("it will be valid", () => {
            User.validateSchema({name: { first: "Adil", last: "Hello"}})
        })
        it("it will be invalid", () => {
            User.validateSchema(
                { name: { first: "Adil" }}, true
            )
        })
    })
})