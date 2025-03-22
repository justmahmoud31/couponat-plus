import { Category } from "../../../../database/Models/Category.js";
import { Coupon } from "../../../../database/Models/Coupon.js";
import { Product } from "../../../../database/Models/Product.js";
import { Store } from "../../../../database/Models/Store.js";
import Wishlist from "../../../../database/Models/Wishlist.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getMyWishlist = catchError(async (req, res, next) => {
    const user_id = req.user._id;
    const { type } = req.query;

    let filter = { user_id };
    if (type) {
        if (!["Coupon", "Store", "Category", "Product"].includes(type)) {
            return res.status(400).json({ message: "Invalid type" });
        }
        filter.type = type;
    }

    let wishlist = await Wishlist.find(filter).lean();

    wishlist = await Promise.all(wishlist.map(async (item) => {
        let populatedItem = null;

        if (item.type === "Coupon") {
            populatedItem = await Coupon.findById(item.item_id).select("title code cover_image");
        } else if (item.type === "Store") {
            populatedItem = await Store.findById(item.item_id).select("name logo numberOfCoupons");
        } else if (item.type === "Category") {
            populatedItem = await Category.findById(item.item_id).select("name imageUrl");
        } else if (item.type === "Product") {
            populatedItem = await Product.findById(item.item_id).select("title cover_image");
        }

        return { ...item, itemDetails: populatedItem };
    }));

    res.status(200).json({ message: "Wishlist retrieved successfully", wishlist });
});
