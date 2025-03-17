import { Section } from "../../../../database/Models/Section.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const editSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, addItems, deleteItems } = req.body;

        const section = await Section.findById(id);
        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        if (title) section.title = title;
        if (description) section.description = description;

        // Add items
        if (addItems && Array.isArray(addItems)) {
            section.items.push(...addItems);
        }

        // Delete items
        if (deleteItems && Array.isArray(deleteItems)) {
            section.items = section.items.filter(
                itemId => !deleteItems.includes(itemId.toString())
            );
        }

        await section.save();

        return res.status(200).json({ message: "Section updated successfully", section });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const switchOrder = catchError(async (req, res, next) => {

    const { firstSectionId, secondSectionId } = req.body;

    if (!firstSectionId || !secondSectionId) {
        return res.status(400).json({ message: "Both section IDs are required." });
    }

    const firstSection = await Section.findById(firstSectionId);
    const secondSection = await Section.findById(secondSectionId);

    if (!firstSection || !secondSection) {
        return res.status(404).json({ message: "One or both sections not found." });
    }

    // Swap order values
    const tempOrder = firstSection.order;
    firstSection.order = secondSection.order;
    secondSection.order = tempOrder;

    await firstSection.save();
    await secondSection.save();

    res.status(200).json({ message: "Sections order switched successfully." });
});
export const shiftSection = catchError(async (req, res, next) => {
    const { sectionId, newOrder } = req.body;

    if (!sectionId || newOrder === undefined) {
        return res.status(400).json({ message: "Section ID and new order are required." });
    }

    const section = await Section.findById(sectionId);
    if (!section) {
        return res.status(404).json({ message: "Section not found." });
    }

    const currentOrder = section.order;

    if (currentOrder === newOrder) {
        return res.status(200).json({ message: "No changes needed." });
    }

    // Shift other sections
    if (currentOrder < newOrder) {
        await Section.updateMany(
            { order: { $gt: currentOrder, $lte: newOrder } },
            { $inc: { order: -1 } }
        );
    } else {
        await Section.updateMany(
            { order: { $gte: newOrder, $lt: currentOrder } },
            { $inc: { order: 1 } }
        );
    }

    // Update the target section's order
    section.order = newOrder;
    await section.save();

    res.status(200).json({ message: "Section order updated successfully." });
})