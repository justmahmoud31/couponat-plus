import { Category } from "../../../../database/Models/Category.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

export const getAllCategories = catchError(async (req, res, next) => {
    const allCategories = await Category.find()
        .select('-sub_categories')
        .sort({ createdAt: -1 })
        .populate({
            path: 'parent_id',
            select: 'name  image', // Select specific fields from the parent, adjust as needed
        });

    const categoriesCount = allCategories.length;

    res.status(200).json({
        message: "All Categories retrieved successfully",
        categoriesCount,
        allCategories,
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
                },
            },
        })
        .populate({
            path: 'parent_id',
            // Populate sub-categories for the parent as well (optional)
            populate: {
                path: 'sub_categories',
                select: 'name slug image', // Select necessary fields for optimization
            },
            select: 'name slug image sub_categories', // Select the required fields
            strictPopulate: false, // Avoid errors if parent doesn't exist
        });

    if (!oneCategory) {
        return next(new AppError("Category Not found", 404));
    }

    res.status(200).json({
        message: "Success",
        oneCategory,
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