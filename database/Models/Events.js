import mongoose, { model } from "mongoose";

const EventSchema = mongoose.Schema(
  {
    cover_img: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    link: { type: String },
    isActive: {
      type: Boolean,
      default: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    eventDate: {
      type: Date,
    },
    location: { type: String },
    organizer: { type: String },
    highlightText: { type: String },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
export const Event = mongoose.model("Event", EventSchema);
