import fs from "fs-extra";
import path from "path";
import { Product } from "../../../../database/Models/Product.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

export const deleteProduct = catchError(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
        return next(new AppError("Product Not Found", 404));
    }

    // Helper function to delete a file
    const deleteFile = (filePath) => {
        if (filePath) {
            const absolutePath = path.join(process.cwd(), filePath.replace("/uploads/", ""));
            if (fs.existsSync(absolutePath)) {
                fs.removeSync(absolutePath);
            }
        }
    };

    // Delete all associated product images
    if (product.images && Array.isArray(product.images)) {
        product.images.forEach(deleteFile);
    }
    if (product.cover_image) {
        deleteFile(product.cover_image);
    }
    // Delete product from the database
    await Product.findByIdAndDelete(id);

    res.status(200).json({
        message: "Product and its images deleted successfully"
    });
});
