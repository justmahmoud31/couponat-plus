import { Category } from "../../../../database/Models/Category.js";
import { Product } from "../../../../database/Models/Product.js";
import { Store } from "../../../../database/Models/Store.js";
import { Coupon } from "../../../../database/Models/Coupon.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

export const getAllCategories = catchError(async (req, res, next) => {
  // Get all categories
  const allCategories = await Category.find()
    .select("-sub_categories")
    .sort({ createdAt: -1 })
    .populate({
      path: "parent_id",
      select: "name slug image",
    });

  // Get all category IDs
  const categoryIds = allCategories.map((category) => category._id);

  // Batch count products for all categories in one query
  const productCounts = await Product.aggregate([
    { $match: { category_id: { $in: categoryIds } } },
    { $group: { _id: "$category_id", count: { $sum: 1 } } },
  ]);

  // Batch count stores for all categories in one query
  const storeCounts = await Store.aggregate([
    { $unwind: "$categories" },
    { $match: { categories: { $in: categoryIds } } },
    { $group: { _id: "$categories", count: { $sum: 1 } } },
  ]);

  // Batch count coupons for all categories in one query
  const couponCounts = await Coupon.aggregate([
    { $match: { category_id: { $in: categoryIds } } },
    { $group: { _id: "$category_id", count: { $sum: 1 } } },
  ]);

  // Create lookup maps for quick access
  const productCountMap = new Map(
    productCounts.map((item) => [item._id.toString(), item.count])
  );
  const storeCountMap = new Map(
    storeCounts.map((item) => [item._id.toString(), item.count])
  );
  const couponCountMap = new Map(
    couponCounts.map((item) => [item._id.toString(), item.count])
  );

  // Combine all data
  const categoriesWithCounts = allCategories.map((category) => {
    const categoryId = category._id.toString();
    const productsCount = productCountMap.get(categoryId) || 0;
    const storesCount = storeCountMap.get(categoryId) || 0;
    const couponsCount = couponCountMap.get(categoryId) || 0;

    return {
      ...category.toObject(),
      productsCount,
      storesCount,
      couponsCount,
      totalCount: productsCount + storesCount + couponsCount,
    };
  });

  const categoriesCount = categoriesWithCounts.length;

  res.status(200).json({
    message: "All Categories retrieved successfully",
    categoriesCount,
    allCategories: categoriesWithCounts,
  });
});

export const getOneCategory = catchError(async (req, res, next) => {
  const { id } = req.params;

  const oneCategory = await Category.findById(id)
    .populate({
      path: "sub_categories",
      populate: {
        path: "sub_categories",
        populate: {
          path: "sub_categories",
        },
      },
    })
    .populate({
      path: "parent_id",
      populate: {
        path: "sub_categories",
        select: "name slug image",
      },
      select: "name slug image sub_categories",
      strictPopulate: false,
    });

  if (!oneCategory) {
    return next(new AppError("Category Not found", 404));
  }

  // Get counts for this category
  const categoryId = oneCategory._id;

  // Get counts in parallel for better performance
  const [productsCount, couponsCount, storesCount] = await Promise.all([
    Product.countDocuments({ category_id: categoryId }),
    Coupon.countDocuments({ category_id: categoryId }),
    Store.countDocuments({ categories: categoryId }),
  ]);

  // Convert to object and add counts
  const categoryWithCounts = {
    ...oneCategory.toObject(),
    productsCount,
    storesCount,
    couponsCount,
    totalCount: productsCount + storesCount + couponsCount,
  };

  res.status(200).json({
    message: "Success",
    oneCategory: categoryWithCounts,
  });
});

export const getCategoryBySlug = catchError(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    return next(new AppError("Category Not Found", 404));
  }

  // Get counts for this category
  const categoryId = category._id;

  // Get counts in parallel for better performance
  const [productsCount, couponsCount, storesCount] = await Promise.all([
    Product.countDocuments({ category_id: categoryId }),
    Coupon.countDocuments({ category_id: categoryId }),
    Store.countDocuments({ categories: categoryId }),
  ]);

  // Convert to object and add counts
  const categoryWithCounts = {
    ...category.toObject(),
    productsCount,
    storesCount,
    couponsCount,
    totalCount: productsCount + storesCount + couponsCount,
  };

  res.status(200).json({
    Message: "Success",
    category: categoryWithCounts,
  });
});

export const getByBestCategory = catchError(async (req, res, next) => {
  const category = await Category.findOne({ best: req.params.best });
  if (!category) {
    return next(new AppError("Category Not Found", 404));
  }

  // Get counts for this category
  const categoryId = category._id;

  // Get counts in parallel for better performance
  const [productsCount, couponsCount, storesCount] = await Promise.all([
    Product.countDocuments({ category_id: categoryId }),
    Coupon.countDocuments({ category_id: categoryId }),
    Store.countDocuments({ categories: categoryId }),
  ]);

  // Convert to object and add counts
  const categoryWithCounts = {
    ...category.toObject(),
    productsCount,
    storesCount,
    couponsCount,
    totalCount: productsCount + storesCount + couponsCount,
  };

  res.status(200).json({
    Message: "Success",
    category: categoryWithCounts,
  });
});
