import { model, Schema } from "mongoose";

const schema = new Schema({
    _id: String,
    console_id: Number,
    console_username: String,
    console_linked: Number,
    hide_credit: Boolean,
    credit_amount: Number,
    credit_used: Number
})

export default model("users", schema, "users");
