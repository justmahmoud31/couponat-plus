import { Navigation } from "../../../../database/Models/Navigation.js";
import { Category } from "../../../../database/Models/Category.js";

export const editNavigation = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, sort_order, isActive, category, type } = req.body;

    const navigation = await Navigation.findById(id);
    if (!navigation) {
      return res.status(404).json({ message: "Navigation item not found" });
    }

    if (label !== undefined) navigation.label = label;
    if (sort_order !== undefined) navigation.sort_order = sort_order;
    if (isActive !== undefined) navigation.isActive = isActive;
    if (type !== undefined) navigation.type = type;

    // Only update category if type is 'category'
    if (type === "category" && category !== undefined) {
      // Verify category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists)
        return res.status(404).json({ error: "Category not found" });

      navigation.category = category;
    }

    await navigation.save();

    res
      .status(200)
      .json({ message: "Navigation item updated successfully", navigation });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
