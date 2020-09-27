import { serialize } from "v8";
import { Model } from "..";
import User from "./user";

const connect = () => {
    return Model.connect("mongodb://localhost", "yacs",  { useUnifiedTopology: true });
}

async function run() {
    const driver = await connect()
    const users = User.query.paginate(1);
    console.log(JSON.stringify(await users));
    driver.close();
}

run().catch(err => console.log(err));