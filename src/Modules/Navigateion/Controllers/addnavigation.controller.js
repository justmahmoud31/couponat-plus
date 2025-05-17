import slugify from "slugify";
import { Category } from "../../../../database/Models/Category.js";
import { Navigation } from "../../../../database/Models/Navigation.js";

export const createNavigation = async (req, res) => {
  try {
    const {
      label,
      description,
      parent,
      isContainer,
      sort_order,
      type = "category",
      category_id,
      url,
      icon,
      image,
      highlight,
      highlightColor,
      openInNewTab,
      megaMenu,
      columns,
      displayMobile,
      displayDesktop,
      isActive,
    } = req.body;

    let slug = req.body.slug;
    if (!slug && label) {
      slug = slugify(label, { lower: true });
    }

    if (type === "category" && category_id) {
      const categoryExists = await Category.findById(category_id);
      if (!categoryExists)
        return res.status(400).json({ error: "Category not found" });
    }

    if (type === "external" && !url) {
      return res
        .status(400)
        .json({ error: "URL is required for external links" });
    }

    if (parent) {
      const parentExists = await Navigation.findById(parent);
      if (!parentExists)
        return res
          .status(400)
          .json({ error: "Parent navigation item not found" });
    }

    let nextSortOrder = 1;
    if (!sort_order) {
      const parentQuery = parent ? { parent } : { parent: null };
      const items = await Navigation.find(parentQuery);
      if (items.length > 0) {
        const maxSortOrder = Math.max(
          ...items.map((item) => item.sort_order || 0)
        );
        nextSortOrder = maxSortOrder + 1;
      }
    }

    const navigationData = {
      label,
      slug,
      description,
      parent: parent || null,
      isContainer: isContainer || false,
      sort_order: sort_order || nextSortOrder,
      type,
      url,
      icon,
      image,
      highlight: highlight || false,
      highlightColor,
      openInNewTab: openInNewTab || false,
      megaMenu: megaMenu || false,
      columns: columns || 1,
      displayMobile: displayMobile !== undefined ? displayMobile : true,
      displayDesktop: displayDesktop !== undefined ? displayDesktop : true,
      isActive: isActive !== undefined ? isActive : true,
    };

    if (type === "category" && category_id) {
      navigationData.category_id = category_id;
    }

    const newNav = new Navigation(navigationData);
    await newNav.save();

    const children = await Navigation.find({ parent: newNav._id });

    const populatedNav = await Navigation.findById(newNav._id)
      .populate("category_id", "name slug")
      .populate("parent", "label slug");

    res.status(201).json({
      message: "Navigation item created successfully",
      navigation: populatedNav,
      children: children || [],
    });
  } catch (err) {
    console.error("Error creating navigation:", err);
    res.status(500).json({ error: err.message });
  }
};
