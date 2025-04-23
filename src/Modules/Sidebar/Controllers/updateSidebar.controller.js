import { Sidebar } from "../../../../database/Models/Sidebar.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
import mongoose from "mongoose";

export const updateSidebarItem = catchError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid sidebar item ID", 400));
  }

  const sidebarItem = await Sidebar.findById(id);
  if (!sidebarItem) {
    return next(new AppError("Sidebar item not found", 404));
  }

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

  if (parentId && parentId !== sidebarItem.parentId?.toString()) {
    if (parentId === id) {
      return next(new AppError("Sidebar item cannot be its own parent", 400));
    }

    const parent = await Sidebar.findById(parentId);
    if (!parent) {
      return next(new AppError("Parent sidebar item not found", 404));
    }

    let currentItem = parent;
    while (currentItem.parentId) {
      if (currentItem.parentId.toString() === id) {
        return next(new AppError("Circular reference detected", 400));
      }
      currentItem = await Sidebar.findById(currentItem.parentId);
    }
  }

  const updatedItem = await Sidebar.findByIdAndUpdate(
    id,
    {
      title,
      icon,
      path,
      order,
      isActive,
      parentId: parentId || null,
      description,
      badge,
      badgeColor,
      roles,
      module,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedItem,
  });
});
