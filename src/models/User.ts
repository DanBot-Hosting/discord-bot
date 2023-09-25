import { model, Schema } from "mongoose";

const schema = new Schema({
    _id: String,
    premium_count: Number,
    premium_used: Number
})

export default model("users", schema, "users");
