import mongoose from "mongoose";
import { Category } from "../../../../database/Models/Category.js";
import { Store } from "../../../../database/Models/Store.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
import { Product } from "../../../../database/Models/Product.js";
import { Coupon } from "../../../../database/Models/Coupon.js";
import slugify from "../../../Utils/slugify.js";

export const getAllStores = catchError(async (req, res, next) => {
  let { isDeleted, page = 1, limit = 10, sort = { createdAt: -1 } } = req.query;

  let filter = {};
  if (isDeleted === "true") {
    filter.isDeleted = true;
  } else if (isDeleted === "false") {
    filter.isDeleted = false;
  }
  if (sort === "asc") {
    sort = { createdAt: -1 };
  } else if (sort === "desc") {
    sort = { createdAt: 1 };
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const totalStores = await Store.countDocuments(filter);

  const stores = await Store.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("rates");

  const storesWithCounts = await Promise.all(
    stores
      .filter((store) => store)
      .map(async (store) => {
        try {
          const [categoriesCount, couponsCount, productsCount, ratesCount] =
            await Promise.all([
              Category.countDocuments({ _id: { $in: store.categories || [] } }),
              Coupon.countDocuments({ store_id: store._id }),
              Product.countDocuments({ store_id: store._id }),
              store.rates ? store.rates.length : 0,
            ]);

          return {
            ...store.toObject(),
            categoriesCount,
            couponsCount,
            productsCount,
            ratesCount,
            totalCount: categoriesCount + couponsCount + productsCount,
          };
        } catch (error) {
          console.error("Error processing store data:", error);
          return {
            ...store.toObject(),
            categoriesCount: 0,
            couponsCount: 0,
            productsCount: 0,
            ratesCount: 0,
            totalCount: 0,
          };
        }
      })
  );

  res.status(200).json({
    message: "Success",
    totalStores,
    totalPages: Math.ceil(totalStores / limit),
    currentPage: parseInt(page),
    stores: storesWithCounts,
  });
});

export const getAllActiveStores = catchError(async (req, res, next) => {
  let { page = 1, limit = 10, sort = { createdAt: -1 } } = req.query;

  let filter = {};
  filter.isDeleted = false;
  if (sort === "asc") {
    sort = { createdAt: -1 };
  } else if (sort === "desc") {
    sort = { createdAt: 1 };
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const totalStores = await Store.countDocuments(filter);

  const stores = await Store.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .select(
      "name slug description link logo categories isDeleted createdAt updatedAt"
    )
    .populate("rates");

  const storesWithCounts = await Promise.all(
    stores
      .filter((store) => store)
      .map(async (store) => {
        try {
          const [categoriesCount, couponsCount, productsCount, ratesCount] =
            await Promise.all([
              Category.countDocuments({ _id: { $in: store.categories || [] } }),
              Coupon.countDocuments({ store_id: store._id }),
              Product.countDocuments({ store_id: store._id }),
              store.rates ? store.rates.length : 0,
            ]);

          const storeObject = store.toObject();

          return {
            ...storeObject,
            categoriesCount,
            couponsCount,
            productsCount,
            ratesCount,
            totalCount: categoriesCount + couponsCount + productsCount,
          };
        } catch (error) {
          console.error("Error processing store data:", error);
          return {
            ...store.toObject(),
            categoriesCount: 0,
            couponsCount: 0,
            productsCount: 0,
            ratesCount: 0,
            totalCount: 0,
          };
        }
      })
  );

  res.status(200).json({
    message: "Success",
    totalStores,
    totalPages: Math.ceil(totalStores / limit),
    currentPage: parseInt(page),
    stores: storesWithCounts,
  });
});

export const getOneStore = catchError(async (req, res, next) => {
  const { id } = req.params;

  const oneStore = await Store.findById(id);

  if (!oneStore) {
    return next(new AppError("Store Not Found", 404));
  }

  const [categoriesCount, couponsCount, productsCount, ratesCount] =
    await Promise.all([
      Category.countDocuments({ _id: { $in: oneStore.categories || [] } }),
      Coupon.countDocuments({ store_id: id }),
      Product.countDocuments({ store_id: id }),
      oneStore.rates ? oneStore.rates.length : 0,
    ]);

  const populatedStore = await Store.findById(id).populate([
    { path: "categories" },
    {
      path: "coupons",
      match: { store_id: id },
    },
    { path: "rates" },
    { path: "products" },
  ]);

  const storeWithCounts = {
    ...populatedStore.toObject(),
    categoriesCount,
    couponsCount,
    productsCount,
    ratesCount,
    totalCount: categoriesCount + couponsCount + productsCount,
  };

  res.status(200).json({
    message: "Success",
    oneStore: storeWithCounts,
  });
});

export const getStoresByCategory = catchError(async (req, res, next) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug });
  if (!category) return next(new AppError("Category not found", 404));

  const stores = await Store.find({
    categories: { $in: [category._id] },
    isDeleted: false,
  }).populate("rates");

  const storesWithCounts = await Promise.all(
    stores
      .filter((store) => store)
      .map(async (store) => {
        try {
          const [couponsCount, productsCount, ratesCount] = await Promise.all([
            Coupon.countDocuments({ store_id: store._id }),
            Product.countDocuments({ store_id: store._id }),
            store.rates ? store.rates.length : 0,
          ]);

          return {
            ...store.toObject(),
            couponsCount,
            productsCount,
            ratesCount,
            totalCount: couponsCount + productsCount,
          };
        } catch (error) {
          console.error("Error processing store data:", error);
          return {
            ...store.toObject(),
            couponsCount: 0,
            productsCount: 0,
            ratesCount: 0,
            totalCount: 0,
          };
        }
      })
  );

  res.status(200).json({
    message: "Success",
    count: storesWithCounts.length,
    stores: storesWithCounts,
  });
});

export const getStoreBySlug = catchError(async (req, res, next) => {
  const { slug } = req.params;

  let store = await Store.findOne({ slug });

  if (!store) {
    store = await Store.findOne({
      name: { $regex: new RegExp(`^${slug.replace(/-/g, " ")}$`, "i") },
    });
  }

  if (!store && mongoose.Types.ObjectId.isValid(slug)) {
    store = await Store.findById(slug);
  }

  if (!store) {
    return next(new AppError("Store Not Found", 404));
  }

  if (store && !store.slug) {
    store.slug = slugify(store.name);
    await store.save();
    console.log(
      `Generated and saved slug for store "${store.name}": ${store.slug}`
    );
  }

  const [categoriesCount, couponsCount, productsCount, ratesCount] =
    await Promise.all([
      Category.countDocuments({ _id: { $in: store.categories || [] } }),
      Coupon.countDocuments({ store_id: store._id }),
      Product.countDocuments({ store_id: store._id }),
      store.rates ? store.rates.length : 0,
    ]);

  const populatedStore = await Store.findById(store._id).populate([
    { path: "categories" },
    {
      path: "coupons",
      match: { store_id: store._id },
    },
    { path: "rates" },
    { path: "products" },
  ]);

  const storeWithCounts = {
    ...populatedStore.toObject(),
    categoriesCount,
    couponsCount,
    productsCount,
    ratesCount,
    totalCount: categoriesCount + couponsCount + productsCount,
  };

  res.status(200).json({
    message: "Success",
    oneStore: storeWithCounts,
  });
});
