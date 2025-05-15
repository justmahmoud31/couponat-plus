import { User } from "../../../../database/Models/User.js";
import { Coupon } from "../../../../database/Models/Coupon.js";
import { Product } from "../../../../database/Models/Product.js";
import { Store } from "../../../../database/Models/Store.js";
import { Category } from "../../../../database/Models/Category.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

export const getStats = catchError(async (req, res, next) => {
  const [
    totalUsers,
    totalCoupons,
    totalProducts,
    totalStores,
    totalCategories,
  ] = await Promise.all([
    User.countDocuments(),
    Coupon.countDocuments(),
    Product.countDocuments(),
    Store.countDocuments(),
    Category.countDocuments(),
  ]);

  res.status(200).json({
    message: "Success",
    stats: {
      users: totalUsers,
      coupons: totalCoupons,
      products: totalProducts,
      stores: totalStores,
      categories: totalCategories,
    },
  });
});

export const search = catchError(async (req, res, next) => {
  const { type, query } = req.query;

  if (!type || !query) {
    return next(new AppError("Type and query parameters are required", 400));
  }

  const regex = new RegExp(query, "i");
  let results = {};

  if (type === "all") {
    // If type is "all", search across all collections
    const [users, coupons, products, stores, categories] = await Promise.all([
      User.find({
        $or: [{ username: regex }, { email: regex }],
      }).select("-password -isVerified -otpExpiry -otp"),
      Coupon.find({
        $or: [
          { code: regex },
          { description: regex },
          { title: regex },
          { link: regex },
        ],
      }).populate("store"),
      Product.find({
        $or: [
          { title: regex },
          { description: regex },
          { code: regex },
          { brand_name: regex },
        ],
      }),
      Store.find({
        $or: [{ name: regex }, { description: regex }, { link: regex }],
      }),
      Category.find({
        name: regex,
      }),
    ]);

    results = {
      users,
      coupons,
      products,
      stores,
      categories,
    };
  } else {
    // For specific type searches
    let typeResults = [];

    switch (type) {
      case "users":
        typeResults = await User.find({
          $or: [{ username: regex }, { email: regex }],
        }).select("-password -isVerified -otpExpiry -otp");
        break;
      case "coupons":
        typeResults = await Coupon.find({
          $or: [
            { code: regex },
            { description: regex },
            { title: regex },
            { link: regex },
          ],
        }).populate("store");
        break;
      case "products":
        typeResults = await Product.find({
          $or: [
            { title: regex },
            { description: regex },
            { code: regex },
            { brand_name: regex },
          ],
        });
        break;
      case "stores":
        typeResults = await Store.find({
          $or: [{ name: regex }, { description: regex }, { link: regex }],
        });
        break;
      case "categories":
        typeResults = await Category.find({
          name: regex,
        });
        break;
      default:
        return next(new AppError("Invalid type specified", 400));
    }

    results = typeResults;
  }

  res.status(200).json({
    message: "Success",
    totalResults:
      type === "all"
        ? Object.values(results).reduce((acc, curr) => acc + curr.length, 0)
        : results.length,
    results,
  });
});
