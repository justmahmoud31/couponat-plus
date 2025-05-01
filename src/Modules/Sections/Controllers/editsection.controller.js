import { Section } from "../../../../database/Models/Section.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
import mongoose from "mongoose";

export const editSection = catchError(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    addItems,
    deleteItems,
    isActive,
    order,
    items,
    type,
  } = req.body;

  try {
    const section = await Section.findById(id);
    if (!section) {
      return next(new AppError("Section not found", 404));
    }

    if (order !== undefined) {
      const totalSections = await Section.countDocuments();

      if (!Number.isInteger(order) || order < 1) {
        return next(new AppError("Order must be a positive integer", 400));
      }

      const newOrder = Math.min(order, totalSections);
      const currentOrder = section.order;

      if (newOrder !== currentOrder) {
        const originalItems = [...section.items];

        if (currentOrder < newOrder) {
          await Section.updateMany(
            {
              order: { $gt: currentOrder, $lte: newOrder },
              _id: { $ne: id },
            },
            { $inc: { order: -1 } }
          );
        } else {
          await Section.updateMany(
            {
              order: { $gte: newOrder, $lt: currentOrder },
              _id: { $ne: id },
            },
            { $inc: { order: 1 } }
          );
        }

        section.order = newOrder;
        section.items = originalItems;
      }
    }

    if (title !== undefined) section.title = title;
    if (description !== undefined) section.description = description;
    if (isActive !== undefined) section.isActive = isActive;
    if (type !== undefined) section.type = type;

    if ("items" in req.body) {
      if (Array.isArray(items)) {
        const validItems = items
          .filter((item) => mongoose.Types.ObjectId.isValid(item))
          .map((item) => new mongoose.Types.ObjectId(item)); // Added 'new' here

        section.items = validItems;
        console.log(
          "Section items replaced with:",
          validItems.map((id) => id.toString())
        );
      } else {
        // If items is present but not an array, set it to an empty array
        section.items = [];
        console.log("Section items cleared - empty array set");
      }
    }
    else if (addItems && Array.isArray(addItems)) {
      const validItemsToAdd = addItems
        .filter((item) => mongoose.Types.ObjectId.isValid(item))
        .map((item) => new mongoose.Types.ObjectId(item)); // Added 'new' here

      section.items.push(...validItemsToAdd);
      console.log("Items added to section:", validItemsToAdd);
    } else if (deleteItems && Array.isArray(deleteItems)) {
      section.items = section.items.filter(
        (itemId) => !deleteItems.includes(itemId.toString())
      );
      console.log("Items removed from section:", deleteItems);
    }

    // Save the updated section document
    await section.save();
    console.log(
      "Final section items after save:",
      section.items.map((id) => id.toString())
    );

    return res.status(200).json({
      message: "Section updated successfully",
      section,
    });
  } catch (error) {
    console.error("Error in editSection:", error);
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

  try {
    // Find both sections in one query to reduce database calls
    const [firstSection, secondSection] = await Promise.all([
      Section.findById(firstSectionId),
      Section.findById(secondSectionId),
    ]);

    if (!firstSection) {
      return next(
        new AppError(`Section with ID ${firstSectionId} not found`, 404)
      );
    }

    if (!secondSection) {
      return next(
        new AppError(`Section with ID ${secondSectionId} not found`, 404)
      );
    }

    // Validate that both sections have valid order values
    if (firstSection.order < 1 || secondSection.order < 1) {
      return next(new AppError("Invalid order values", 400));
    }

    // Get the current orders
    const firstOrder = firstSection.order;
    const secondOrder = secondSection.order;

    if (firstOrder === secondOrder) {
      return res
        .status(200)
        .json({ message: "Sections already have the same order" });
    }

    // Get total count to calculate a safe temporary order
    const totalSections = await Section.countDocuments();
    const tempOrder = totalSections + 1000; // Use a value well outside normal range

    // Use two-step update process with temporary order to avoid duplicates
    // First, move first section to temp order
    await Section.findByIdAndUpdate(firstSectionId, { order: tempOrder });

    // Then move second section to first order
    await Section.findByIdAndUpdate(secondSectionId, { order: firstOrder });

    // Finally move first section to second order
    await Section.findByIdAndUpdate(firstSectionId, { order: secondOrder });

    // For non-consecutive orders, adjust intermediate sections
    if (Math.abs(firstOrder - secondOrder) > 1) {
      // If first came before second in ordering
      if (firstOrder < secondOrder) {
        // Shift sections between first and second down by 1
        await Section.updateMany(
          {
            order: { $gt: firstOrder, $lt: secondOrder },
            _id: { $nin: [firstSectionId, secondSectionId] },
          },
          { $inc: { order: -1 } }
        );
      } else {
        // First came after second
        // Shift sections between second and first up by 1
        await Section.updateMany(
          {
            order: { $gt: secondOrder, $lt: firstOrder },
            _id: { $nin: [firstSectionId, secondSectionId] },
          },
          { $inc: { order: 1 } }
        );
      }
    }

    res.status(200).json({
      message: "Sections order switched successfully",
      updatedSections: [
        { id: firstSectionId, newOrder: secondOrder },
        { id: secondSectionId, newOrder: firstOrder },
      ],
    });
  } catch (error) {
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

  try {
    // Get total count to validate maximum order value
    const totalSections = await Section.countDocuments();

    if (newOrder > totalSections) {
      return next(
        new AppError(
          `New order (${newOrder}) exceeds the total number of sections (${totalSections})`,
          400
        )
      );
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return next(new AppError("Section not found", 404));
    }

    const currentOrder = section.order;

    if (currentOrder === newOrder) {
      return res.status(200).json({ message: "No changes needed" });
    }

    // Get a temporary order value outside the range of valid orders
    // This prevents unique constraint violations during reordering
    const tempOrder = totalSections + 1000;

    // First set to temp order to avoid conflicts
    await Section.findByIdAndUpdate(sectionId, { order: tempOrder });

    // Shift other sections based on direction
    if (currentOrder < newOrder) {
      // Moving down: Decrement orders of sections between current and new positions
      await Section.updateMany(
        {
          order: { $gt: currentOrder, $lte: newOrder },
          _id: { $ne: sectionId },
        },
        { $inc: { order: -1 } }
      );
    } else {
      // Moving up: Increment orders of sections between new and current positions
      await Section.updateMany(
        {
          order: { $gte: newOrder, $lt: currentOrder },
          _id: { $ne: sectionId },
        },
        { $inc: { order: 1 } }
      );
    }

    // Finally, set to the new order
    await Section.findByIdAndUpdate(sectionId, { order: newOrder });

    res.status(200).json({
      message: "Section order updated successfully",
      section: { id: sectionId, previousOrder: currentOrder, newOrder },
    });
  } catch (error) {
    return next(new AppError(`Error shifting section: ${error.message}`, 500));
  }
});

/**
 * Normalize all section orders to fix any issues
 * This is a maintenance function to repair ordering problems
 */
export const normalizeOrders = catchError(async (req, res, next) => {
  try {
    // Get all sections sorted by current order
    const sections = await Section.find().sort({ order: 1 });

    if (!sections.length) {
      return res.status(200).json({ message: "No sections to normalize" });
    }

    // Assign sequential order values
    const updates = sections.map((section, index) => {
      return Section.findByIdAndUpdate(section._id, { order: index + 1 });
    });

    await Promise.all(updates);

    res.status(200).json({
      message: "Section orders normalized successfully",
      count: sections.length,
    });
  } catch (error) {
    return next(
      new AppError(`Error normalizing section orders: ${error.message}`, 500)
    );
  }
});
