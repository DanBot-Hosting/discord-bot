import { model, Schema } from "mongoose";

const schema = new Schema({
    _id: String,
    premium_servers: Number
})

export default model("users", schema, "users");
