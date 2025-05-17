import { SidebarAd } from "../../../../database/Models/SidebarAd.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
import fs from "fs";

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const addSidebarAd = catchError(async (req, res, next) => {
  const {
    title,
    description,
    link,
    linkText,
    module,
    isActive,
    bgColor,
    textColor,
    buttonBgColor,
    buttonTextColor,
    order,
    startDate,
    endDate,
    showOnPages,
  } = req.body;

  if (!title || !description || !link || !linkText || !module) {
    return next(new AppError("Missing required fields", 400));
  }

  let imagePath = null;
  if (req.file) {
    imagePath = req.file.path;
  }

  const sidebarAd = await SidebarAd.create({
    title,
    description,
    image: imagePath,
    link,
    linkText,
    module,
    isActive: isActive !== undefined ? isActive : true,
    bgColor: bgColor || "#00BFA6",
    textColor: textColor || "#FFFFFF",
    buttonBgColor: buttonBgColor || "#FFFFFF",
    buttonTextColor: buttonTextColor || "#00BFA6",
    order: order || 1,
    startDate: startDate || null,
    endDate: endDate || null,
    showOnPages: showOnPages ? JSON.parse(showOnPages) : [],
  });

  res.status(201).json({
    status: "success",
    data: sidebarAd,
  });
});

export const updateSidebarAd = catchError(async (req, res, next) => {
  const { id } = req.params;

  const existingSidebarAd = await SidebarAd.findById(id);
  if (!existingSidebarAd) {
    return next(new AppError("Sidebar ad not found", 404));
  }

  const {
    title,
    description,
    link,
    linkText,
    module,
    isActive,
    bgColor,
    textColor,
    buttonBgColor,
    buttonTextColor,
    order,
    startDate,
    endDate,
    showOnPages,
  } = req.body;

  let imagePath = existingSidebarAd.image;
  if (req.file) {
    if (existingSidebarAd.image) {
      deleteFile(existingSidebarAd.image);
    }
    imagePath = req.file.path;
  }

  const updatedSidebarAd = await SidebarAd.findByIdAndUpdate(
    id,
    {
      title: title || existingSidebarAd.title,
      description: description || existingSidebarAd.description,
      image: imagePath,
      link: link || existingSidebarAd.link,
      linkText: linkText || existingSidebarAd.linkText,
      module: module || existingSidebarAd.module,
      isActive: isActive !== undefined ? isActive : existingSidebarAd.isActive,
      bgColor: bgColor || existingSidebarAd.bgColor,
      textColor: textColor || existingSidebarAd.textColor,
      buttonBgColor: buttonBgColor || existingSidebarAd.buttonBgColor,
      buttonTextColor: buttonTextColor || existingSidebarAd.buttonTextColor,
      order: order || existingSidebarAd.order,
      startDate: startDate || existingSidebarAd.startDate,
      endDate: endDate || existingSidebarAd.endDate,
      showOnPages: showOnPages
        ? JSON.parse(showOnPages)
        : existingSidebarAd.showOnPages,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedSidebarAd,
  });
});
