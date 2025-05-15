import slugify from "slugify";
import { Category } from "../../../../database/Models/Category.js";
import { Navigation } from "../../../../database/Models/Navigation.js";

export const createNavigation = async (req, res) => {
  try {
    //   const { error } = validateNavigation(req.body);
    //   if (error) return res.status(400).json({ error: error.details[0].message });

    const {
      category,
      label,
      sort_order,
      isActive,
      type = "category",
    } = req.body;

    // If type is category, ensure category exists
    if (type === "category" && category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists)
        return res.status(404).json({ error: "Category not found" });
    }

    // For special types, we don't need a category reference
    const navigationData = {
      label,
      slug: slugify(label, { lower: true }),
      sort_order,
      isActive,
      type,
    };

    // Only add category if type is 'category'
    if (type === "category" && category) {
      navigationData.category = category;
    }

    const newNav = new Navigation(navigationData);

    await newNav.save();
    res.status(201).json(newNav);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
