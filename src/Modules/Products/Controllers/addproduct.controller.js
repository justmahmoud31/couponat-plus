import mongoose from "mongoose";
import { Product } from "../../../../database/Models/Product.js";
import { validateProduct } from "../product.validation.js";
import { catchError } from "../../../Middlewares/catchError.js";
import fs from "fs-extra";
import path from "path";

export const addproduct = catchError(async (req, res, next) => {
    try {
        const { title, description, link, code, brand_name, price, discounted_price, category_id, related_product } = req.body;

        // Convert related_product and category_id to ObjectId if provided
        const productData = {
            title,
            description,
            link,
            code,
            brand_name,
            price,
            discounted_price,
            category_id: category_id ? new mongoose.Types.ObjectId(category_id) : null,
            related_product: related_product ? related_product.split(",").map(id => new mongoose.Types.ObjectId(id)) : [],
            images: req.files["images"] ? req.files["images"].map(file => file.path) : [],
            cover_image: req.files["cover_image"] ? req.files["cover_image"][0].path : null,
        };

        // Validate product data using Joi
        const { error } = validateProduct(productData);
        if (error) {
            return res.status(400).json({ success: false, errors: error.details.map(err => err.message) });
        }

        // Save the product
        const product = new Product(productData);
        await product.save();

        res.status(201).json({ success: true, message: "Product added successfully", data: product });
    } catch (error) {
        next(error);
    }
});
