import { model, Schema } from "mongoose";

const schema = new Schema({
    _id: String,
    credit_amount: Number,
    credit_used: Number
})

export default model("users", schema, "users");
