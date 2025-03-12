import mongoose, { model } from "mongoose";

const EventSchema = mongoose.Schema({
    cover_img: { type: String },
    name: { type: String },
    link: { type: String },
}, {
    timestamps: true
});
export const Event = mongoose.model("Event", EventSchema);