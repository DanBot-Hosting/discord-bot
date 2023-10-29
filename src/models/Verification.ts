import { model, Schema } from "mongoose";

const schema = new Schema({
    _id: String,
    created: Number,
    user: String
})

export default model("verification", schema, "verification");
