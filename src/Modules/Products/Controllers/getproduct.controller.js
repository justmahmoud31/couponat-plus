import { Product } from "../../../../database/Models/Product.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

export const getAllProducts = catchError(async (req, res, next) => {
    const allProducts = await Product.find();
    const productsCount = allProducts.length;
    res.status(200).json({
        Message: "Products Retrived Succefully",
        productsCount,
        allProducts
    });
})
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
})