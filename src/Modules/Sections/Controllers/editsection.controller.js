import { Section } from "../../../../database/Models/Section.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
import mongoose from "mongoose";

export const editSection = catchError(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, addItems, deleteItems, isActive, order } =
    req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const section = await Section.findById(id).session(session);
    if (!section) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("Section not found", 404));
    }

    // Handle order change separately with proper reordering
    if (order !== undefined) {
      const totalSections = await Section.countDocuments();

      // Validate order is a positive integer
      if (!Number.isInteger(order) || order < 1) {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError("Order must be a positive integer", 400));
      }

      // If order exceeds total, cap it at total
      const newOrder = Math.min(order, totalSections);
      const currentOrder = section.order;

      // Only process if order actually changes
      if (newOrder !== currentOrder) {
        // Temporarily set order to a value outside normal range
        const tempOrder = totalSections + 1000;
        await Section.findByIdAndUpdate(id, { order: tempOrder }, { session });

        // Shift other sections based on direction of movement
        if (currentOrder < newOrder) {
          // Moving down: shift sections in between down
          await Section.updateMany(
            {
              order: { $gt: currentOrder, $lte: newOrder },
              _id: { $ne: id },
            },
            { $inc: { order: -1 } },
            { session }
          );
        } else {
          // Moving up: shift sections in between up
          await Section.updateMany(
            {
              order: { $gte: newOrder, $lt: currentOrder },
              _id: { $ne: id },
            },
            { $inc: { order: 1 } },
            { session }
          );
        }

        // Update to the new order
        section.order = newOrder;
      }
    }

    // Update other fields
    if (title !== undefined) section.title = title;
    if (description !== undefined) section.description = description;
    if (isActive !== undefined) section.isActive = isActive;

    // Add items
    if (addItems && Array.isArray(addItems)) {
      // Filter out invalid IDs and duplicates
      const validItemsToAdd = addItems
        .filter((item) => mongoose.Types.ObjectId.isValid(item))
        .filter((item) => !section.items.includes(item));

      section.items.push(...validItemsToAdd);
    }

    // Delete items
    if (deleteItems && Array.isArray(deleteItems)) {
      section.items = section.items.filter(
        (itemId) => !deleteItems.includes(itemId.toString())
      );
    }

    await section.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Section updated successfully",
      section,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new AppError(`Error updating section: ${error.message}`, 500));
  }
});

/**
 * Handles the situation when we want to swap positions between sections
 * If sections have consecutive orders (e.g., 3 and 4), simply swaps their order values
 * If sections have non-consecutive orders (e.g., 2 and 5), all sections in between are shifted
 */
export const switchOrder = catchError(async (req, res, next) => {
  const { firstSectionId, secondSectionId } = req.body;

  if (!firstSectionId || !secondSectionId) {
    return next(new AppError("Both section IDs are required", 400));
  }

  // Use a session to ensure atomic operation
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find both sections in one query to reduce database calls
    const [firstSection, secondSection] = await Promise.all([
      Section.findById(firstSectionId).session(session),
      Section.findById(secondSectionId).session(session),
    ]);

    if (!firstSection) {
      await session.abortTransaction();
      return next(
        new AppError(`Section with ID ${firstSectionId} not found`, 404)
      );
    }

    if (!secondSection) {
      await session.abortTransaction();
      return next(
        new AppError(`Section with ID ${secondSectionId} not found`, 404)
      );
    }

    // Validate that both sections have valid order values
    if (firstSection.order < 1 || secondSection.order < 1) {
      await session.abortTransaction();
      return next(new AppError("Invalid order values", 400));
    }

    // Get the current orders
    const firstOrder = firstSection.order;
    const secondOrder = secondSection.order;

    // For non-consecutive orders, we need to shift intermediate sections
    // to maintain the order sequence integrity
    if (Math.abs(firstOrder - secondOrder) > 1) {
      // If first comes before second in ordering
      if (firstOrder < secondOrder) {
        // Shift sections between first and second down by 1
        await Section.updateMany(
          {
            order: { $gt: firstOrder, $lt: secondOrder },
            _id: { $nin: [firstSectionId, secondSectionId] },
          },
          { $inc: { order: -1 } },
          { session }
        );
        // Move second to first + 1
        secondSection.order = firstOrder + 1;
      } else {
        // First comes after second
        // Shift sections between second and first up by 1
        await Section.updateMany(
          {
            order: { $gt: secondOrder, $lt: firstOrder },
            _id: { $nin: [firstSectionId, secondSectionId] },
          },
          { $inc: { order: 1 } },
          { session }
        );
        // Move first to second + 1
        firstSection.order = secondOrder + 1;
      }
    } else {
      // For consecutive or same orders, just swap
      const tempOrder = firstSection.order;
      firstSection.order = secondSection.order;
      secondSection.order = tempOrder;
    }

    // Save both sections within the transaction
    await Promise.all([
      firstSection.save({ session }),
      secondSection.save({ session }),
    ]);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Sections order switched successfully",
      updatedSections: [
        { id: firstSection._id, newOrder: firstSection.order },
        { id: secondSection._id, newOrder: secondSection.order },
      ],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(
      new AppError(`Error switching section orders: ${error.message}`, 500)
    );
  }
});

/**
 * Shift section to a new position and reorder all affected sections
 */
export const shiftSection = catchError(async (req, res, next) => {
  const { sectionId, newOrder } = req.body;

  if (!sectionId || newOrder === undefined) {
    return next(new AppError("Section ID and new order are required", 400));
  }

  // Validate newOrder is a positive integer
  if (!Number.isInteger(newOrder) || newOrder < 1) {
    return next(new AppError("Order must be a positive integer", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get total count to validate maximum order value
    const totalSections = await Section.countDocuments();

    if (newOrder > totalSections) {
      await session.abortTransaction();
      return next(
        new AppError(
          `New order (${newOrder}) exceeds the total number of sections (${totalSections})`,
          400
        )
      );
    }

    const section = await Section.findById(sectionId).session(session);
    if (!section) {
      await session.abortTransaction();
      return next(new AppError("Section not found", 404));
    }

    const currentOrder = section.order;

    if (currentOrder === newOrder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({ message: "No changes needed" });
    }

    // Get a temporary order value outside the range of valid orders
    // This prevents unique constraint violations during reordering
    const tempOrder = totalSections + 1000;

    // First set to temp order to avoid conflicts
    await Section.findByIdAndUpdate(
      sectionId,
      { order: tempOrder },
      { session }
    );

    // Shift other sections based on direction
    if (currentOrder < newOrder) {
      // Moving down: Decrement orders of sections between current and new positions
      await Section.updateMany(
        {
          order: { $gt: currentOrder, $lte: newOrder },
          _id: { $ne: sectionId },
        },
        { $inc: { order: -1 } },
        { session }
      );
    } else {
      // Moving up: Increment orders of sections between new and current positions
      await Section.updateMany(
        {
          order: { $gte: newOrder, $lt: currentOrder },
          _id: { $ne: sectionId },
        },
        { $inc: { order: 1 } },
        { session }
      );
    }

    // Finally, set to the new order
    await Section.findByIdAndUpdate(
      sectionId,
      { order: newOrder },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Section order updated successfully",
      section: { id: sectionId, previousOrder: currentOrder, newOrder },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new AppError(`Error shifting section: ${error.message}`, 500));
  }
});

/**
 * Normalize all section orders to fix any issues
 * This is a maintenance function to repair ordering problems
 */
export const normalizeOrders = catchError(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get all sections sorted by current order
    const sections = await Section.find().sort({ order: 1 }).session(session);

    if (!sections.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({ message: "No sections to normalize" });
    }

    // Assign sequential order values
    const updates = sections.map((section, index) => {
      return Section.findByIdAndUpdate(
        section._id,
        { order: index + 1 },
        { session }
      );
    });

    await Promise.all(updates);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Section orders normalized successfully",
      count: sections.length,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(
      new AppError(`Error normalizing section orders: ${error.message}`, 500)
    );
  }
});
