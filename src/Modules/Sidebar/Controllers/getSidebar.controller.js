import { Sidebar } from "../../../../database/Models/Sidebar.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getSidebar = catchError(async (req, res, next) => {
  const { module, role } = req.query;

  let filter = { isActive: true };

  if (module) {
    filter.module = module;
  }

  if (role) {
    filter.$or = [
      { roles: { $in: [role] } },
      { roles: { $size: 0 } },
    ];
  }

  const parentItems = await Sidebar.find({
    ...filter,
    parentId: null,
  }).sort({ order: 1 });

  const childItems = await Sidebar.find({
    ...filter,
    parentId: { $ne: null },
  }).sort({ order: 1 });

  const childItemsByParent = childItems.reduce((acc, item) => {
    const parentId = item.parentId.toString();
    if (!acc[parentId]) {
      acc[parentId] = [];
    }
    acc[parentId].push(item);
    return acc;
  }, {});

  const sidebarItems = parentItems.map((item) => {
    const itemObj = item.toObject();
    const parentId = item._id.toString();

    if (childItemsByParent[parentId]) {
      itemObj.children = childItemsByParent[parentId];
    }

    return itemObj;
  });

  res.status(200).json({
    status: "success",
    results: sidebarItems.length,
    data: sidebarItems,
  });
});
