import { model, Schema } from "mongoose";

const schema = new Schema({
    _id: String,
    channel: String,
    created: Number,
    owner: String
})

export default model("testing-channels", schema, "testing-channels");
