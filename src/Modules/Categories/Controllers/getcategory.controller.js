import { Category } from "../../../../database/Models/Category.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

export const getAllCategories = catchError(async (req, res, next) => {
    const allCategories = await Category.find();
    const categoriesCount = allCategories.length;
    res.status(200).json({
        "Message": "All Categories retrived Succesffully",
        categoriesCount,
        allCategories
    })
});
export const getOneCategory = catchError(async (req, res, next) => {
    const { id } = req.params;
    const oneCategory = await Category.findById(id);
    if (!oneCategory) {
        return next(new AppError("Category Not found", 404));
    }
    res.status(200).json({
        Message: "Success",
        oneCategory
    })
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