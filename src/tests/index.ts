import { Model } from "..";
import User from "./user";

const connect = () => {
    return Model.connect("mongodb://localhost", "yacs",  { useUnifiedTopology: true });
}

async function run() {
    const driver = await connect()
    const user = await User.query.latest().first();
    const results = await User.collection.insertMany([
        {_id: null, name: "Adil"}, {_id: false, name: "Aqil"}
    ]);
    console.log("inserted", results);
    // console.log(user?.attributes);
    driver.close();
}

run().catch(err => console.log(err));