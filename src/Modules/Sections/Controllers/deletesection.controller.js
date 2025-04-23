import { Section } from "../../../../database/Models/Section.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
import mongoose from "mongoose";

export const deleteSection = catchError(async (req, res, next) => {
  const { id } = req.params;

  try {
    const section = await Section.findById(id);
    if (!section) {
      return next(new AppError("Section not found", 404));
    }

    const currentOrder = section.order;

    await Section.findByIdAndDelete(id);

    await Section.updateMany(
      { order: { $gt: currentOrder } },
      { $inc: { order: -1 } }
    );

    return res.status(200).json({
      message: "Section deleted successfully and orders adjusted",
      deletedSection: {
        id: section._id,
        title: section.title,
        deletedFromOrder: currentOrder,
      },
    });
  } catch (error) {
    return next(new AppError(`Error deleting section: ${error.message}`, 500));
  }
});
