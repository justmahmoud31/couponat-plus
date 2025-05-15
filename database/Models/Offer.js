import mongoose from "mongoose";
import slugify from "../../src/Utils/slugify.js";

const OfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    cover_image: {
      type: String,
    },
    benefitLink: {
      type: String,
    },
    expireDate: {
      type: Date,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

OfferSchema.pre("save", function (next) {
  if (!this.slug || this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  // Ensure discount and discountPercentage are in sync
  if (
    this.isModified("discountPercentage") &&
    this.discountPercentage !== undefined
  ) {
    this.discount = this.discountPercentage;
  } else if (this.isModified("discount") && this.discount !== undefined) {
    this.discountPercentage = this.discount;
  }

  // Ensure cover_image and image are in sync
  if (this.isModified("image") && this.image && !this.cover_image) {
    this.cover_image = this.image;
  } else if (
    this.isModified("cover_image") &&
    this.cover_image &&
    !this.image
  ) {
    this.image = this.cover_image;
  }

  next();
});

export const Offer = mongoose.model("Offer", OfferSchema);
