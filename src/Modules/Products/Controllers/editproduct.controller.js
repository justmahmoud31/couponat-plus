import { catchError } from "../../../Middlewares/catchError.js";
import { Product } from "../../../../database/Models/Product.js";
import { AppError } from "../../../Utils/AppError.js";

export const editProduct = catchError(async (req, res, next) => {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle new cover image
    if (req.files?.cover_image) {
        updateData.cover_image = `/uploads/products/${req.files.cover_image[0].filename}`;
    }

    // Handle new images
    if (req.files?.images) {
        updateData.images = req.files.images.map(file => `/uploads/products/${file.filename}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
        return next(new AppError("Product Not Found", 404));
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
});
