import { model, Schema } from "mongoose";

const schema = new Schema({
    _id: String,
    console_id: Number,
    console_username: String,
    console_linked: Number,
    hide_premium: Boolean,
    premium_count: Number,
    premium_used: Number
})

export default model("users", schema, "users");
