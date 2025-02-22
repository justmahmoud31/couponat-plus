import mongoose from "mongoose";
import { Coupon } from "../../../../database/Models/Coupon.js"; 
import {catchError} from "../../../Middlewares/catchError.js";

const addCoupon = catchError(async (req, res, next) => {
    try {
        const { title, description, link, category_id, related_coupons } = req.body;

        // Validate required fields
        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        // Construct coupon data
        let couponData = {
            title,
            description,
            link,
            category_id: category_id ? new mongoose.Types.ObjectId(category_id) : null,
            related_coupons: related_coupons ? related_coupons.split(",").map(id => new mongoose.Types.ObjectId(id)) : [],
            image: req.files["image"] ? req.files["image"][0].path : null,
            cover_image: req.files["cover_image"] ? req.files["cover_image"][0].path : null
        };

        // Save the coupon
        let coupon = new Coupon(couponData);
        await coupon.save();

        res.status(201).json({ success: true, message: "Coupon added successfully", data: coupon });
    } catch (error) {
        next(error);
    }
});

export { addCoupon };
