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
    const user = await user_1.default.query.first();
    console.log(user?.name);
    driver.close();
}
run().catch(err => console.log(err));
