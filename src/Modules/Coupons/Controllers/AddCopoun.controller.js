import mongoose from "mongoose";
import { Coupon } from "../../../../database/Models/Coupon.js";
import { validateCoupon } from "../copouns.validations.js";
import { catchError } from "../../../Middlewares/catchError.js";

const addCoupon = catchError(async (req, res, next) => {
    try {
        const { title, description, link, code, type, category_id, expireDate, discount } = req.body;
        let couponData = {
            title,
            description,
            link,
            code,
            type,
            category_id: category_id || undefined,
            expireDate,
            image: req.files["image"] ? req.files["image"][0].path : null,
            cover_image: req.files["cover_image"] ? req.files["cover_image"][0].path : null,
            discount
        };

        const { error } = validateCoupon(couponData);
        if (error) {
            return res.status(400).json({ success: false, errors: error.details.map(err => err.message) });
        }

        let coupon = new Coupon(couponData);
        await coupon.save();

        res.status(201).json({ success: true, message: "Coupon added successfully", data: coupon });
    } catch (error) {
        next(error);
    }
});

export { addCoupon };
