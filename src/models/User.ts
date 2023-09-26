import { model, Schema } from "mongoose";

const schema = new Schema({
    _id: String,
    hide_premium: Boolean,
    premium_count: Number,
    premium_used: Number
})

export default model("users", schema, "users");
