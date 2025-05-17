import mongoose from "mongoose";

const NavigationSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    slug: { type: String },
    description: { type: String },

    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Navigation" },
    isContainer: { type: Boolean, default: false },
    sort_order: { type: Number, default: 0 },

    type: {
      type: String,
      enum: [
        "category",
        "page",
        "external",
        "allCategories",
        "allCoupons",
        "allStores",
        "allProducts",
        "allOffers",
      ],
      default: "category",
    },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    url: { type: String }, // For external links

    icon: { type: String },
    image: { type: String },
    highlight: { type: Boolean, default: false },
    highlightColor: { type: String },
    openInNewTab: { type: Boolean, default: false },

    megaMenu: { type: Boolean, default: false },
    columns: { type: Number, default: 1 },

    // Display settings
    displayMobile: { type: Boolean, default: true }, // Show on mobile
    displayDesktop: { type: Boolean, default: true }, // Show on desktop
    isActive: { type: Boolean, default: true },

    // When the navigation should be visible
    visibleFrom: { type: Date },
    visibleTo: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for children items
NavigationSchema.virtual("children", {
  ref: "Navigation",
  localField: "_id",
  foreignField: "parent",
  options: { sort: { sort_order: 1 } },
});

export const Navigation = mongoose.model("Navigation", NavigationSchema);
