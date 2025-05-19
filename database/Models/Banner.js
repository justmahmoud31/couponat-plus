import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  path: { type: String, required: true },
  link: { type: String },
});

const BannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    images: [
      {
        type: mongoose.Schema.Types.Mixed,
        get: function (image) {
          if (typeof image === "string") {
            return image;
          }
          return image;
        },
      },
    ],
    type: {
      type: String,
      enum: [
        "slider",
        "static",
        "twoBanner",
        "bannerText",
        "Slider",
        "Static",
        "TwoBanner",
        "BannerText",
      ],
      required: true,
    },
    link: { type: String },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);
export const Banner = mongoose.model("Banner", BannerSchema);
