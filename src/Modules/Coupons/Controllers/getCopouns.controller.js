import { Coupon } from "../../../../database/Models/Coupon.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
import mongoose from "mongoose";

const getAllCopouns = catchError(async (req, res, next) => {
  const {
    category,
    categoryId,
    storeId,
    sort,
    page = 1,
    limit = 20,
  } = req.query;

  let filter = { isActive: true, isDeleted: false };

  const categoryParameter = categoryId || category;

  if (categoryParameter) {
    if (mongoose.Types.ObjectId.isValid(categoryParameter)) {
      filter.category_id = new mongoose.Types.ObjectId(categoryParameter);
    } else {
      return res.status(400).json({ message: "Invalid category ID" });
    }
  }

  // Filter by store if provided
  if (storeId) {
    if (mongoose.Types.ObjectId.isValid(storeId)) {
      filter.store_id = new mongoose.Types.ObjectId(storeId);
    } else {
      return res.status(400).json({ message: "Invalid store ID" });
    }
  }

  const sortOrder = sort === "asc" ? 1 : -1;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get total count of coupons
  const totalCoupons = await Coupon.countDocuments(filter);

  // Fetch paginated coupons
  const allCoupons = await Coupon.find(filter)
    .sort({ createdAt: sortOrder })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("category_id", "name")
    .populate("store_id", "name logo");

  res.status(200).json({
    message: "Coupons retrieved successfully",
    totalCoupons,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalCoupons / limit),
    couponsCount: allCoupons.length,
    allCoupons,
  });
});

const getOneCopoun = catchError(async (req, res, next) => {
  const { id } = req.params;

  let coupon = await Coupon.findById(id)
    .populate("category_id", "name") // ✅ Get only the name
    .populate("store_id");

  if (!coupon) {
    return next(new AppError("Coupon not found or Invalid Id", 400));
  }

  // ✅ Fetch related coupons (same category or same store), excluding itself
  const relatedCoupons = await Coupon.find({
    _id: { $ne: coupon._id }, // Exclude the current coupon
    $or: [
      { category_id: coupon.category_id?._id },
      { store_id: coupon.store_id?._id },
    ],
  })
    .populate("category_id", "name") // ✅ Get only the name
    .populate("store_id");
  coupon = coupon.toObject();
  coupon.relatedCoupons = relatedCoupons;

  res.status(200).json({
    message: "Coupon found successfully",
    coupon,
  });
});

export { getAllCopouns, getOneCopoun };
