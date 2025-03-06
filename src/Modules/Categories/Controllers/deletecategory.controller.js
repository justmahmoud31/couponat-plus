import { Category } from "../../../../database/Models/Category.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
import fs from "fs-extra";
import path from "path";


export const deleteCategory = catchError(async (req, res, next) => {
    const { id } = req.params;

    const oneCategory = await Category.findById(id);
    if (!oneCategory) {
        return next(new AppError("Category not found", 404));
    }

    if (oneCategory.image) {
        const oldImagePath = path.join("uploads", oneCategory.image.replace("uploads/", ""));
        if (fs.existsSync(oldImagePath)) {
            fs.removeSync(oldImagePath);
        }
    }

    // Delete the category itself
    await Category.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Category deleted successfully"
    });
});
