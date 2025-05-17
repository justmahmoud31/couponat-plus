import mongoose from "mongoose";
import { Coupon } from "../../../../database/Models/Coupon.js";
import { validateCoupon } from "../copouns.validations.js";
import { catchError } from "../../../Middlewares/catchError.js";

const addCoupon = catchError(async (req, res, next) => {
  try {
    const {
      title,
      description,
      link,
      code,
      type,
      category_id,
      expireDate,
      discount,
    } = req.body;

    let categories;

    if (Array.isArray(category_id)) {
      categories = category_id;
    } else if (typeof category_id === "string") {
      try {
        const parsed = JSON.parse(category_id);
        if (Array.isArray(parsed)) {
          categories = parsed;
          console.log("Successfully parsed category_id JSON:", categories);
        } else {
          // Fallback to old format
          categories = [category_id];
        }
      } catch (err) {
        // Not JSON, check if it's comma-separated
        if (category_id.includes(",")) {
          categories = category_id.split(",");
        } else {
          // Single ID
          categories = [category_id];
        }
      }
    } else if (category_id) {
      categories = [category_id];
    } else {
      categories = [];
    }

    const validCategories = categories
      .filter((catId) => mongoose.Types.ObjectId.isValid(catId))
      .map((catId) => new mongoose.Types.ObjectId(catId));

    let couponData = {
      title,
      description,
      link,
      code,
      type,
      category_id: validCategories,
      expireDate,
      image: req.files["image"] ? req.files["image"][0].path : null,
      cover_image: req.files["cover_image"]
        ? req.files["cover_image"][0].path
        : null,
      discount,
    };

    const { error } = validateCoupon(couponData);
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    let coupon = new Coupon(couponData);
    await coupon.save();

    res.status(201).json({
      success: true,
      message: "Coupon added successfully",
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
});

export { addCoupon };
