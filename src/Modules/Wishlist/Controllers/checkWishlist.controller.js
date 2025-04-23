import mongoose from "mongoose";
import { catchError } from "../../../Middlewares/catchError.js";
import Wishlist from "../../../../database/Models/Wishlist.js";

export const checkWishlistItem = catchError(async (req, res, next) => {
  const { type, itemId } = req.query;
  const user_id = req.user._id;

  if (!["Coupon", "Store", "Category", "Product"].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  const wishlistItem = await Wishlist.findOne({
    user_id,
    type,
    item_id: itemId,
  });

  res.status(200).json({
    isInWishlist: !!wishlistItem,
  });
});
