import { Product } from "../../../../database/Models/Product.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getAllProducts = catchError(async (req, res, next) => {
    const allProducts = await Product.find();
    const productsCount = allProducts.length;
    res.status(200).json({
        Message: "Products Retrived Succefully",
        productsCount,
        allProducts
    });
})