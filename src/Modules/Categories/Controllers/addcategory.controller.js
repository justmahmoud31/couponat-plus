import slugify from "slugify";
import { Category } from "../../../../database/Models/Category.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { validateCategory } from "../categories.validation.js";

export const addCategory = catchError(async (req, res, next) => {
    const { name, parent_id, sub_categories, items_count, count, best } = req.body;

    // Uploaded file path (if exists)
    const image = req.file ? req.file.path : null;

    // Validate input data
    const { error } = validateCategory({ name, parent_id, sub_categories, items_count, count, image, best });
    if (error) {
        return res.status(400).json({ success: false, message: error.details.map(err => err.message) });
    }
    const slug = slugify(name);
    // Create new category
    const category = new Category({
        name,
        slug,
        image,
        best,
        parent_id: parent_id || null,
        sub_categories: sub_categories ? JSON.parse(sub_categories) : [],
        items_count: items_count || 0,
        count: count || 0,
    });

    // Save category in the database
    await category.save();

    return res.status(201).json({ success: true, message: "Category added successfully", category });
})