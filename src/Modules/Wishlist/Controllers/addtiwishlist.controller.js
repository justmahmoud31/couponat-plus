import mongoose from "mongoose";
import { catchError } from "../../../Middlewares/catchError.js";
import Wishlist from "../../../../database/Models/Wishlist.js";

export const addToWishlist = catchError(async (req, res, next) => {
    const { type, item_id } = req.body;
    const user_id = req.user._id;

    if (!["Coupon", "Store", "Category", "Product"].includes(type)) {
        return res.status(400).json({ message: "Invalid type" });
    }

    if (!mongoose.Types.ObjectId.isValid(item_id)) {
        return res.status(400).json({ message: "Invalid item ID" });
    }

    const wishlistItem = new Wishlist({ user_id, type, item_id });
    await wishlistItem.save();

    res.status(201).json({ message: "Added to wishlist successfully" });
});


