import { Product } from "../../../../database/Models/Product.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

export const getAllProducts = catchError(async (req, res, next) => {
    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    // Get total count of products
    const totalProducts = await Product.countDocuments();

    // Fetch paginated products
    const allProducts = await Product.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        message: "Products retrieved successfully",
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        productsCount: allProducts.length,
        allProducts
    });
});

export const getOneProduct = catchError(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return next(new AppError("Product Not Found", 404));
    }
    res.status(200).json({
        Message: "Product retrived succesfully",
        product
    })
});
