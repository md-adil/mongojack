"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const user_1 = __importDefault(require("./user"));
const connect = () => {
    return __1.Model.connect("mongodb://localhost", "yacs", { useUnifiedTopology: true });
};
async function run() {
    const driver = await connect();
    const users = user_1.default.query.paginate(1);
    console.log(JSON.stringify(await users));
    driver.close();
}
run().catch(err => console.log(err));
