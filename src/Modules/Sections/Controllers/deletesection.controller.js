import { Section } from "../../../../database/Models/Section.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
import mongoose from "mongoose";

export const deleteSection = catchError(async (req, res, next) => {
  const { id } = req.params;

  // Start a transaction to ensure data consistency
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the section exists
    const section = await Section.findById(id).session(session);
    if (!section) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("Section not found", 404));
    }

    // Get the current order value
    const currentOrder = section.order;

    // Delete the section
    await Section.findByIdAndDelete(id).session(session);

    // Update order of all sections with higher order by decrementing by 1
    // This maintains the sequential order of remaining sections
    await Section.updateMany(
      { order: { $gt: currentOrder } },
      { $inc: { order: -1 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Section deleted successfully and orders adjusted",
      deletedSection: {
        id: section._id,
        title: section.title,
        deletedFromOrder: currentOrder,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new AppError(`Error deleting section: ${error.message}`, 500));
  }
});
