import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        type: {
            type: String,
            enum: ["Coupon", "Store", "Category", "Product"],
            required: true
        },
        item_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    { timestamps: true }
);

WishlistSchema.index({ user_id: 1, type: 1, item_id: 1 }, { unique: true });

export default mongoose.model("Wishlist", WishlistSchema);
