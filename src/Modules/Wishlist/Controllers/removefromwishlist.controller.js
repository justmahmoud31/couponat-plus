import Wishlist from "../../../../database/Models/Wishlist.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const removeFromWishlist = catchError(async (req, res, next) => {
    const { type, item_id } = req.body;
    const user_id = req.user._id;

    const deletedItem = await Wishlist.findOneAndDelete({ user_id, type, item_id });

    if (!deletedItem) {
        return res.status(404).json({ message: "Item not found in wishlist" });
    }

    res.status(200).json({ message: "Removed from wishlist successfully" });
});