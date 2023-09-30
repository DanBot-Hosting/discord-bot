import { model, Schema } from "mongoose";

const schema = new Schema({
    channel: String,
    created: Number,
    owner: String
})

export default model("testing-channels", schema, "testing-channels");
