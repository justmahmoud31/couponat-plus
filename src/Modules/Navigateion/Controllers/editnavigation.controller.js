import { Navigation } from "../../../../database/Models/Navigation.js";
import { Category } from "../../../../database/Models/Category.js";
import slugify from "slugify";

export const editNavigation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      label,
      description,
      parent,
      isContainer,
      sort_order,
      type,
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

    const navigation = await Navigation.findById(id);
    if (!navigation) {
      return res.status(404).json({ message: "Navigation item not found" });
    }

    if (label && label !== navigation.label && !req.body.slug) {
      navigation.slug = slugify(label, { lower: true });
    } else if (req.body.slug) {
      navigation.slug = req.body.slug;
    }

    if (label !== undefined) navigation.label = label;
    if (description !== undefined) navigation.description = description;
    if (parent !== undefined) {
      const parentValue = parent === "" ? null : parent;

      if (parentValue === navigation._id.toString()) {
        return res
          .status(400)
          .json({ error: "Navigation item cannot be its own parent" });
      }

      if (parentValue) {
        const parentExists = await Navigation.findById(parentValue);
        if (!parentExists) {
          return res
            .status(400)
            .json({ error: "Parent navigation item not found" });
        }

        let currentParent = parentValue;
        while (currentParent) {
          if (currentParent === id) {
            return res.status(400).json({
              error: "Circular reference detected in navigation hierarchy",
            });
          }
          const parentNav = await Navigation.findById(currentParent);
          currentParent = parentNav ? parentNav.parent : null;
        }
      }

      navigation.parent = parentValue;
    }
    if (isContainer !== undefined) navigation.isContainer = isContainer;

    if (sort_order !== undefined && sort_order !== navigation.sort_order) {
      const parentValue = navigation.parent;
      const parentQuery = parentValue
        ? { parent: parentValue }
        : { parent: null };

      const items = await Navigation.find(parentQuery);

      const maxPossibleSortOrder = items.length;

      let newSortOrder = sort_order;
      if (newSortOrder > maxPossibleSortOrder) {
        newSortOrder = maxPossibleSortOrder;
      }
      if (newSortOrder < 1) {
        newSortOrder = 1;
      }

      const targetItem = items.find(
        (item) => item.sort_order === newSortOrder && item._id.toString() !== id
      );

      const oldSortOrder = navigation.sort_order;

      navigation.sort_order = newSortOrder;

      if (targetItem) {
        targetItem.sort_order = oldSortOrder;
        await targetItem.save();
      }
    }

    if (type !== undefined) navigation.type = type;
    if (url !== undefined) navigation.url = url;
    if (icon !== undefined) navigation.icon = icon;
    if (image !== undefined) navigation.image = image;
    if (highlight !== undefined) navigation.highlight = highlight;
    if (highlightColor !== undefined)
      navigation.highlightColor = highlightColor;
    if (openInNewTab !== undefined) navigation.openInNewTab = openInNewTab;
    if (megaMenu !== undefined) navigation.megaMenu = megaMenu;
    if (columns !== undefined) navigation.columns = columns;
    if (displayMobile !== undefined) navigation.displayMobile = displayMobile;
    if (displayDesktop !== undefined)
      navigation.displayDesktop = displayDesktop;
    if (isActive !== undefined) navigation.isActive = isActive;

    if (type === "category") {
      if (category_id) {
        const categoryExists = await Category.findById(category_id);
        if (!categoryExists) {
          return res.status(400).json({ error: "Category not found" });
        }
        navigation.category_id = category_id;
      }
    } else {
      navigation.category_id = null;
    }

    if (type === "external" && !navigation.url) {
      return res
        .status(400)
        .json({ error: "URL is required for external links" });
    }

    await navigation.save();

    const children = await Navigation.find({ parent: id }).populate(
      "category_id",
      "name slug"
    );

    const updatedNavigation = await Navigation.findById(id)
      .populate("category_id", "name slug")
      .populate("parent", "label slug");

    res.status(200).json({
      message: "Navigation item updated successfully",
      navigation: updatedNavigation,
      children: children || [],
    });
  } catch (error) {
    console.error("Error updating navigation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
