import { Sidebar } from "../../../../database/Models/Sidebar.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
import mongoose from "mongoose";

export const deleteSidebarItem = catchError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid sidebar item ID", 400));
  }

  const sidebarItem = await Sidebar.findById(id);
  if (!sidebarItem) {
    return next(new AppError("Sidebar item not found", 404));
  }

  const childrenCount = await Sidebar.countDocuments({ parentId: id });
  if (childrenCount > 0) {
    return next(
      new AppError(
        "Cannot delete sidebar item with children. Delete children first or reassign them.",
        400
      )
    );
  }

  await Sidebar.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    message: "Sidebar item deleted successfully",
  });
});
