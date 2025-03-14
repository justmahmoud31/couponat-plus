import slugify from "slugify";
import { Category } from "../../../../database/Models/Category.js";
import { Product } from "../../../../database/Models/Product.js";
import { Coupon } from "../../../../database/Models/Coupon.js";
import { Store } from "../../../../database/Models/Store.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { validateCategory } from "../categories.validation.js";

export const addCategory = catchError(async (req, res, next) => {
    const { name, parent_id, sub_categories, best } = req.body;
    const image = req.file ? req.file.path : null;

    const { error } = validateCategory({ name, parent_id, sub_categories, image, best });
    if (error) {
        return res.status(400).json({ success: false, message: error.details.map(err => err.message) });
    }

    const slug = slugify(name);
    // Initialize the category without counts
    const category = new Category({
        name,
        slug,
        image,
        best,
        parent_id: parent_id || null,
        sub_categories: sub_categories ? JSON.parse(sub_categories) : [],
    });

    await category.save();

    // Dynamically calculate counts
    const [itemsCount, productCount, couponCount, storeCount] = await Promise.all([
        Category.countDocuments({ parent_id: category._id }),
        Product.countDocuments({ category: category._id }),
        Coupon.countDocuments({ category: category._id }),
        Store.countDocuments({ category: category._id }),
    ]);

    const totalCount = productCount + couponCount + storeCount;

    // Update the category with dynamic counts
    await Category.findByIdAndUpdate(category._id, {
        items_count: itemsCount,
        count: totalCount,
    });

    let populatedParentCategory = null;

    // If there's a parent category, update its sub_categories and items_count
    if (parent_id) {
        const updatedParent = await Category.findByIdAndUpdate(
            parent_id,
            { 
                $addToSet: { sub_categories: category._id }, 
                $inc: { items_count: 1 } 
            },
            { new: true }
        ).populate('sub_categories');
        
        populatedParentCategory = updatedParent;
    }

    return res.status(201).json({
        success: true,
        message: "Category added successfully",
        category,
        parentCategory: populatedParentCategory,
    });
});
