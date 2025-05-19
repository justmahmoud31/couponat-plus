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
      filter.category_id = {
        $in: [new mongoose.Types.ObjectId(categoryParameter)],
      };
    } else {
      return res.status(400).json({ message: "Invalid category ID" });
    }
  }

  if (storeId) {
    if (mongoose.Types.ObjectId.isValid(storeId)) {
      filter.store_id = new mongoose.Types.ObjectId(storeId);
    } else {
      return res.status(400).json({ message: "Invalid store ID" });
    }
  }

  const sortOrder = sort === "asc" ? 1 : -1;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const totalCoupons = await Coupon.countDocuments(filter);

  const allCoupons = await Coupon.find(filter)
    .populate("category_id")
    .populate("store_id", "name logo")
    .sort({ createdAt: sortOrder })
    .skip(skip)
    .limit(parseInt(limit));

  const formattedCoupons = allCoupons.map((coupon) => {
    const plainCoupon = coupon.toObject();
    plainCoupon.categories = plainCoupon.category_id;
    return plainCoupon;
  });

  res.status(200).json({
    message: "Coupons retrieved successfully",
    totalCoupons,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalCoupons / limit),
    couponsCount: formattedCoupons.length,
    allCoupons: formattedCoupons,
  });
});

const getOneCopoun = catchError(async (req, res, next) => {
  const { id } = req.params;

  let couponDoc = await Coupon.findById(id)
    .populate("category_id")
    .populate("store_id");

  if (!couponDoc) {
    return next(new AppError("Coupon not found or Invalid Id", 400));
  }

  const coupon = couponDoc.toObject();

  coupon.categories = coupon.category_id;

  const relatedQuery = {
    _id: { $ne: coupon._id },
    $or: [],
  };

  if (coupon.category_id && coupon.category_id.length > 0) {
    const categoryIds = coupon.category_id.map((cat) => cat._id);
    relatedQuery.$or.push({ category_id: { $in: categoryIds } });
  }

  if (coupon.store_id && coupon.store_id._id) {
    relatedQuery.$or.push({ store_id: coupon.store_id._id });
  }

  const relatedCoupons =
    relatedQuery.$or.length > 0
      ? await Coupon.find(relatedQuery)
          .populate("category_id")
          .populate("store_id")
      : [];

  coupon.relatedCoupons = relatedCoupons.map((relCoupon) => {
    const plainRelCoupon = relCoupon.toObject();
    plainRelCoupon.categories = plainRelCoupon.category_id;
    return plainRelCoupon;
  });

  res.status(200).json({
    message: "Coupon found successfully",
    coupon,
  });
});

const getCouponBySlug = catchError(async (req, res, next) => {
  const { slug } = req.params;
  const couponDoc = await Coupon.findOne({ slug })
    .populate("category_id")
    .populate("store_id");

  if (!couponDoc) {
    return next(new AppError("Coupon not found or Invalid Id", 400));
  }

  const coupon = couponDoc.toObject();

  coupon.categories = coupon.category_id;

  res.status(200).json({
    message: "Coupon found successfully",
    coupon,
  });
});

export { getAllCopouns, getOneCopoun, getCouponBySlug };
