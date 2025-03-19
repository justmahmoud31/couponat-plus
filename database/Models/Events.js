import mongoose, { model } from "mongoose";

const EventSchema = mongoose.Schema({
    cover_img: { type: String },
    name: { type: String },
    link: { type: String },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
export const Event = mongoose.model("Event", EventSchema);