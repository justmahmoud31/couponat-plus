import { Section } from "../../../../database/Models/Section.js";
import { catchError } from "../../../Middlewares/catchError.js";

const addSection = catchError(async (req, res, next) => {
    const { title, description, banner_id, store_id, text, type, category_id, order } = req.body;

    // Validate required fields
    if (!title || !type) {
        return res.status(400).json({ message: "Title and type are required" });
    }

    // Get the highest order value and increment it if order is not provided
    let newOrder = order;
    if (newOrder === undefined) {
        const lastSection = await Section.findOne().sort({ order: -1 }); // Get the highest order
        newOrder = lastSection ? lastSection.order + 1 : 1; // Set order dynamically
    }

    // Create the new section
    const newSection = new Section({
        title,
        description,
        banner_id,
        store_id,
        text,
        type,
        category_id,
        order: newOrder
    });

    // Save to the database
    await newSection.save();

    res.status(201).json({
        message: "Section created successfully",
        section: newSection,
    });
});
export { addSection };