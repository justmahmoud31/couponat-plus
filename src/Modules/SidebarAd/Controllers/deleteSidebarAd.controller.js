import { SidebarAd } from "../../../../database/Models/SidebarAd.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
import fs from "fs";

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const deleteSidebarAd = catchError(async (req, res, next) => {
  const { id } = req.params;

  const sidebarAd = await SidebarAd.findById(id);

  if (!sidebarAd) {
    return next(new AppError("Sidebar ad not found", 404));
  }

  // Delete associated image file if it exists
  if (sidebarAd.image) {
    deleteFile(sidebarAd.image);
  }

  await SidebarAd.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    message: "Sidebar ad deleted successfully",
  });
});
