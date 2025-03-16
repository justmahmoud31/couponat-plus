import mongoose from "mongoose";
import { Category } from "../../../../database/Models/Category.js";
import { Store } from "../../../../database/Models/Store.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
import { Product } from "../../../../database/Models/Product.js";

export const getAllStores = catchError(async (req, res, next) => {
    const { isDeleted } = req.query;

    let filter = {};
    if (isDeleted === "true") {
        filter.isDeleted = true;
    } else if (isDeleted === "false") {
        filter.isDeleted = false;
    }

    const stores = await Store.aggregate([
        { $match: filter },
        // Lookup and count categories
        {
            $lookup: {
                from: "categories",
                localField: "categories",
                foreignField: "_id",
                as: "categoriesList",
            },
        },
        // Lookup and count coupons
        {
            $lookup: {
                from: "coupons",
                localField: "coupons",
                foreignField: "_id",
                as: "couponsList",
            },
        },
        // Lookup and count products
        {
            $lookup: {
                from: "products",
                localField: "products",
                foreignField: "_id",
                as: "productsList",
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                logo: 1,
                description: 1,
                link: 1,
                createdAt: 1,
                updatedAt: 1,
                numberOfCategories: { $size: "$categoriesList" },
                numberOfCoupons: { $size: "$couponsList" },
                numberOfProducts: { $size: "$productsList" },
            },
        },
        { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
        message: "Success",
        totalStores: stores.length,
        stores,
    });
});
export const getOneStore = catchError(async (req, res, next) => {
    const oneStore = await Store.findById(req.params.id).populate([
        { path: 'categories' },
        { path: 'coupons' },
        { path: 'rates' },
        { path: 'products' },  // Added products population
    ]);

    if (!oneStore) {
        return next(new AppError("Store Not Found", 404));
    }

    res.status(200).json({
        message: "Success",
        oneStore,
    });
});

export const getStoresByCategory = catchError(async (req, res, next) => {
    const { slug } = req.params;
    // Find category by slug
    const category = await Category.findOne({ slug });
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }
    // Find stores associated with this category and that are not deleted
    const stores = await Store.find({
        categories: new mongoose.Types.ObjectId(category._id),
        isDeleted: false,
    });

    res.status(200).json({
        message: "Stores retrieved successfully",
        count: stores.length,
        stores,
    });
});
