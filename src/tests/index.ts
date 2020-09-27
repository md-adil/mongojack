import { Model } from "..";
import User from "./user";

const connect = () => {
    return Model.connect("mongodb://localhost", "yacs",  { useUnifiedTopology: true });
}

async function run() {
    const driver = await connect()
    const user = await User.query.first();
    console.log(user?.name);
    driver.close();
}

run().catch(err => console.log(err));