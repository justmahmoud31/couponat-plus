import { Coupon } from "../../../../database/Models/Coupon.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

export const getMostUsedCoupons = catchError(async (req, res, next) => {
  const { limit = 20, page = 1 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const coupons = await Coupon.find({ isDeleted: false, isActive: true })
    .sort({ usageCount: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("store_id")
    .populate("category_id");

  res.status(200).json({
    message: "Most used coupons retrieved successfully",
    count: coupons.length,
    coupons,
  });
});

export const getNewCoupons = catchError(async (req, res, next) => {
  const { limit = 20, page = 1 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const coupons = await Coupon.find({
    createdAt: { $gte: oneWeekAgo },
    isDeleted: false,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("store_id")
    .populate("category_id");

  res.status(200).json({
    message: "New coupons retrieved successfully",
    count: coupons.length,
    coupons,
  });
});

export const getExpiringSoonCoupons = catchError(async (req, res, next) => {
  const { limit = 20, page = 1 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const coupons = await Coupon.find({
    expireDate: { $gte: today, $lte: nextWeek },
    isDeleted: false,
    isActive: true,
  })
    .sort({ expireDate: 1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("store_id")
    .populate("category_id");

  res.status(200).json({
    message: "Expiring soon coupons retrieved successfully",
    count: coupons.length,
    coupons,
  });
});

export const trackCouponUsage = catchError(async (req, res, next) => {
  const { id } = req.params;
  const { action } = req.body; // 'view', 'copy', 'click'

  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return next(new AppError("Coupon not found", 404));
  }

  if (action === "view") {
    coupon.viewCount = (coupon.viewCount || 0) + 1;
  } else if (action === "copy") {
    coupon.copyCount = (coupon.copyCount || 0) + 1;
    coupon.usageCount = (coupon.usageCount || 0) + 1;
  } else if (action === "click") {
    coupon.clickCount = (coupon.clickCount || 0) + 1;
    coupon.usageCount = (coupon.usageCount || 0) + 1;
  }

  coupon.lastActivityDate = new Date();
  await coupon.save();

  res.status(200).json({
    success: true,
    message: "Coupon usage tracked successfully",
  });
});
