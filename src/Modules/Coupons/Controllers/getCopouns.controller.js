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
    .sort({ createdAt: sortOrder })
    .skip(skip)
    .limit(parseInt(limit));

  const populatedCoupons = await Promise.all(
    allCoupons.map(async (coupon) => {
      const plainCoupon = coupon.toObject();

      if (!Array.isArray(plainCoupon.category_id)) {
        plainCoupon.category_id = plainCoupon.category_id
          ? [plainCoupon.category_id]
          : [];
      }

      if (plainCoupon.category_id && plainCoupon.category_id.length > 0) {
        const categories = await mongoose
          .model("Category")
          .find({ _id: { $in: plainCoupon.category_id } })
          .select("name slug image");
        plainCoupon.categories = categories;
      } else {
        plainCoupon.categories = [];
      }

      if (plainCoupon.store_id) {
        const store = await mongoose
          .model("Store")
          .findById(plainCoupon.store_id)
          .select("name logo");
        plainCoupon.store_id = store;
      }

      return plainCoupon;
    })
  );

  res.status(200).json({
    message: "Coupons retrieved successfully",
    totalCoupons,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalCoupons / limit),
    couponsCount: populatedCoupons.length,
    allCoupons: populatedCoupons,
  });
});

const getOneCopoun = catchError(async (req, res, next) => {
  const { id } = req.params;

  let coupon = await Coupon.findById(id);

  if (!coupon) {
    return next(new AppError("Coupon not found or Invalid Id", 400));
  }

  coupon = coupon.toObject();

  if (!Array.isArray(coupon.category_id)) {
    coupon.category_id = coupon.category_id ? [coupon.category_id] : [];
  }

  if (coupon.category_id && coupon.category_id.length > 0) {
    try {
      const categories = await mongoose
        .model("Category")
        .find({ _id: { $in: coupon.category_id } })
        .select("name slug image");
      coupon.categories = categories;
    } catch (error) {
      console.log("Error populating categories:", error);
      coupon.categories = [];
    }
  } else {
    coupon.categories = [];
  }

  if (coupon.store_id) {
    try {
      const store = await mongoose.model("Store").findById(coupon.store_id);
      coupon.store_id = store;
    } catch (error) {
      console.log("Error populating store:", error);
    }
  }

  // Build a query for related coupons
  const relatedQuery = {
    _id: { $ne: coupon._id },
    $or: [],
  };

  if (coupon.category_id && coupon.category_id.length > 0) {
    relatedQuery.$or.push({ category_id: { $in: coupon.category_id } });
  }

  // If we have a store, add related store condition
  if (coupon.store_id && coupon.store_id._id) {
    relatedQuery.$or.push({ store_id: coupon.store_id._id });
  }

  // Only proceed with the query if we have valid conditions
  const relatedCoupons =
    relatedQuery.$or.length > 0 ? await Coupon.find(relatedQuery) : [];

  // Process related coupons to ensure category_id is an array
  coupon.relatedCoupons = await Promise.all(
    relatedCoupons.map(async (relCoupon) => {
      const plainRelCoupon = relCoupon.toObject();

      if (!Array.isArray(plainRelCoupon.category_id)) {
        plainRelCoupon.category_id = plainRelCoupon.category_id
          ? [plainRelCoupon.category_id]
          : [];
      }

      // Populate categories for related coupons
      if (plainRelCoupon.category_id && plainRelCoupon.category_id.length > 0) {
        try {
          const categories = await mongoose
            .model("Category")
            .find({ _id: { $in: plainRelCoupon.category_id } })
            .select("name slug image");
          plainRelCoupon.categories = categories;
        } catch (error) {
          console.log("Error populating categories for related coupon:", error);
          plainRelCoupon.categories = [];
        }
      } else {
        plainRelCoupon.categories = [];
      }

      if (plainRelCoupon.store_id) {
        try {
          const store = await mongoose
            .model("Store")
            .findById(plainRelCoupon.store_id);
          plainRelCoupon.store_id = store;
        } catch (error) {
          console.log("Error populating store for related coupon:", error);
        }
      }

      return plainRelCoupon;
    })
  );

  res.status(200).json({
    message: "Coupon found successfully",
    coupon,
  });
});

const getCouponBySlug = catchError(async (req, res, next) => {
  const { slug } = req.params;
  const couponDoc = await Coupon.findOne({ slug });
  if (!couponDoc) {
    return next(new AppError("Coupon not found or Invalid Id", 400));
  }

  const coupon = couponDoc.toObject();

  if (!Array.isArray(coupon.category_id)) {
    coupon.category_id = coupon.category_id ? [coupon.category_id] : [];
  }

  if (coupon.category_id && coupon.category_id.length > 0) {
    try {
      const categories = await mongoose
        .model("Category")
        .find({ _id: { $in: coupon.category_id } })
        .select("name slug image");
      coupon.categories = categories;
    } catch (error) {
      console.log("Error populating categories:", error);
      coupon.categories = [];
    }
  } else {
    coupon.categories = [];
  }

  // Populate store if exists
  if (coupon.store_id) {
    try {
      const store = await mongoose.model("Store").findById(coupon.store_id);
      coupon.store_id = store;
    } catch (error) {
      console.log("Error populating store:", error);
    }
  }

  res.status(200).json({
    message: "Coupon found successfully",
    coupon,
  });
});

export { getAllCopouns, getOneCopoun, getCouponBySlug };
