import { Sidebar } from "../../../../database/Models/Sidebar.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
import mongoose from "mongoose";

export const addSidebarItem = catchError(async (req, res, next) => {
  const {
    title,
    icon,
    path,
    order,
    isActive,
    parentId,
    description,
    badge,
    badgeColor,
    roles,
    module,
  } = req.body;

  // Validation
  if (!title || !path) {
    return next(new AppError("Title and path are required", 400));
  }

  // Validate parentId if provided
  if (parentId) {
    const parent = await Sidebar.findById(parentId);
    if (!parent) {
      return next(new AppError("Parent sidebar item not found", 404));
    }
  }

  // Find the max order if not provided
  let itemOrder = order;
  if (!itemOrder) {
    const maxOrderItem = await Sidebar.findOne({
      parentId: parentId || null,
    }).sort({ order: -1 });

    itemOrder = maxOrderItem ? maxOrderItem.order + 1 : 1;
  }

  // Create the sidebar item
  const sidebarItem = await Sidebar.create({
    title,
    icon,
    path,
    order: itemOrder,
    isActive: isActive !== undefined ? isActive : true,
    parentId: parentId || null,
    description,
    badge,
    badgeColor,
    roles: roles || [],
    module,
  });

  res.status(201).json({
    status: "success",
    data: sidebarItem,
  });
});
