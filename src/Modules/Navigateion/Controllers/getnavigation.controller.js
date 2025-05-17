import { Navigation } from "../../../../database/Models/Navigation.js";

export const getAllNavigations = async (req, res) => {
  try {
    const { isActive, parentOnly, withChildren } = req.query;

    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (parentOnly === "true") {
      query.parent = null;
    }

    const now = new Date();
    if (req.query.respectVisibility === "true") {
      query.$or = [
        { visibleFrom: { $exists: false } },
        { visibleFrom: null },
        { visibleFrom: { $lte: now } },
      ];

      query.$and = [
        {
          $or: [
            { visibleTo: { $exists: false } },
            { visibleTo: null },
            { visibleTo: { $gte: now } },
          ],
        },
      ];
    }

    let navigations;

    if (withChildren === "true") {
      navigations = await Navigation.find(query)
        .populate("category_id", "name slug")
        .populate("parent", "label slug")
        .populate({
          path: "children",
          populate: {
            path: "category_id",
            select: "name slug",
          },
        })
        .sort({ sort_order: 1 });
    } else {
      navigations = await Navigation.find(query)
        .populate("category_id", "name slug")
        .populate("parent", "label slug")
        .sort({ sort_order: 1 });
    }

    res.status(200).json({
      message: "Success",
      navigations,
      count: navigations.length,
    });
  } catch (err) {
    console.error("Error fetching navigations:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getNavigationById = async (req, res) => {
  try {
    const { withChildren } = req.query;

    let navigation;

    if (withChildren === "true") {
      navigation = await Navigation.findById(req.params.id)
        .populate("category_id", "name slug")
        .populate("parent", "label slug")
        .populate({
          path: "children",
          populate: {
            path: "category_id",
            select: "name slug",
          },
        });
    } else {
      navigation = await Navigation.findById(req.params.id)
        .populate("category_id", "name slug")
        .populate("parent", "label slug");
    }

    if (!navigation) {
      return res.status(404).json({ error: "Navigation not found" });
    }

    res.status(200).json({
      message: "Success",
      navigation,
    });
  } catch (err) {
    console.error("Error fetching navigation:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getNavigationTree = async (req, res) => {
  try {
    const rootNavigations = await Navigation.find({ parent: null })
      .populate("category_id", "name slug")
      .sort({ sort_order: 1 });

    const populateChildren = async (items) => {
      const result = [];

      for (const item of items) {
        const children = await Navigation.find({ parent: item._id })
          .populate("category_id", "name slug")
          .sort({ sort_order: 1 });

        const populatedChildren =
          children.length > 0 ? await populateChildren(children) : [];

        result.push({
          ...item.toObject(),
          children: populatedChildren,
        });
      }

      return result;
    };

    const navigationTree = await populateChildren(rootNavigations);

    res.status(200).json({
      message: "Success",
      navigationTree,
    });
  } catch (err) {
    console.error("Error fetching navigation tree:", err);
    res.status(500).json({ error: err.message });
  }
};
