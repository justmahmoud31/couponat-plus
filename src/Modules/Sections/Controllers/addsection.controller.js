import { Section } from "../../../../database/Models/Section.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { sectionValidation } from "../section.validation.js";
import { AppError } from "../../../Utils/AppError.js";
import mongoose from "mongoose";

export const addSection = catchError(async (req, res, next) => {
  // Validate input
  const { error } = sectionValidation.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const {
    title,
    description,
    banner_id,
    store_id,
    text,
    type,
    category_id,
    product_id,
    order,
    items,
    isActive,
    event_id,
  } = req.body;

  // Start a session to ensure data consistency
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Count total sections to validate order value
    const totalSections = await Section.countDocuments();

    let newOrder = order;

    // Handle different order scenarios
    if (newOrder === undefined) {
      // If no order specified, add to the end
      const lastSection = await Section.findOne()
        .sort({ order: -1 })
        .session(session);
      newOrder = lastSection ? lastSection.order + 1 : 1;
    } else {
      // Validate order is a positive integer
      if (!Number.isInteger(newOrder) || newOrder < 1) {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError("Order must be a positive integer", 400));
      }

      // If order exceeds total + 1, automatically adjust to the end
      // This handles cases like trying to set order=9 when only 5 sections exist
      if (newOrder > totalSections + 1) {
        console.log(
          `Order value ${newOrder} exceeds maximum allowed (${
            totalSections + 1
          }). Adjusted to end position.`
        );
        newOrder = totalSections + 1;
      }

      // If inserting at a specific position, shift others down
      if (newOrder <= totalSections) {
        await Section.updateMany(
          { order: { $gte: newOrder } },
          { $inc: { order: 1 } },
          { session }
        );
      }
    }

    // Create new section
    const newSection = new Section({
      title,
      description,
      banner_id,
      store_id,
      text,
      type,
      category_id,
      product_id,
      event_id,
      items: items || [],
      order: newOrder,
      isActive: isActive !== undefined ? isActive : true,
    });

    await newSection.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Section created successfully",
      section: newSection,
      orderInfo: {
        position: newOrder,
        totalSections: totalSections + 1,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Handle duplicate order error explicitly
    if (error.code === 11000 && error.keyPattern && error.keyPattern.order) {
      return next(
        new AppError(
          "Duplicate order value. Try again or let the system assign the order automatically.",
          400
        )
      );
    }

    return next(new AppError(`Error creating section: ${error.message}`, 500));
  }
});
