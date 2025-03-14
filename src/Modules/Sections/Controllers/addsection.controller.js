
import { Section } from "../../../../database/Models/Section.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { sectionValidation } from "../section.validation.js";

const addSection = catchError(async (req, res, next) => {
    const { error } = sectionValidation.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { title, description, banner_id, store_id, text, type, category_id, product_id, order, items } = req.body;

    let newOrder = order;
    if (newOrder === undefined) {
        const lastSection = await Section.findOne().sort({ order: -1 });
        newOrder = lastSection ? lastSection.order + 1 : 1;
    }

    const newSection = new Section({
        title,
        description,
        banner_id,
        store_id,
        text,
        type,
        category_id,
        product_id,
        items: items || [],
        order: newOrder,
    });

    await newSection.save();

    res.status(201).json({
        message: "Section created successfully",
        section: newSection,
    });
});

export { addSection };
