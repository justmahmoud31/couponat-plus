import { Category } from "../../../../database/Models/Category.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

export const getAllCategories = catchError(async (req, res, next) => {
    const allCategories = await Category.find().select('-sub_categories').sort({ createdAt: -1 });
    const categoriesCount = allCategories.length;
    res.status(200).json({
        message: "All Categories retrieved successfully",
        categoriesCount,
        allCategories
    });
});

export const getOneCategory = catchError(async (req, res, next) => {
    const { id } = req.params;

    const oneCategory = await Category.findById(id)
        .populate({
            path: 'sub_categories',
            populate: {
                path: 'sub_categories',
                populate: {
                    path: 'sub_categories',
                    // You can keep nesting as deep as you need
                }
            }
        });

    if (!oneCategory) {
        return next(new AppError("Category Not found", 404));
    }

    res.status(200).json({
        message: "Success",
        oneCategory
    });
});

export const getCategoryBySlug = catchError(async (req, res, next) => {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
        return next(new AppError("Category Not Found", 404));
    }
    res.status(200).json({
        Message: "Success",
        category
    })
});
export const getByBestCategory = catchError(async (req, res, next) => {
    const category = await Category.findOne({ best: req.params.best });
    if (!category) {
        return next(new AppError("Category Not Found", 404));
    }
    res.status(200).json({
        Message: "Success",
        category
    })
})