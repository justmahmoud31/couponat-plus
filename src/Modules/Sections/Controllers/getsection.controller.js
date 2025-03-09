import { Section } from "../../../../database/Models/Section.js";
import { catchError } from "../../../Middlewares/catchError.js";

const getSection = catchError(async (req, res, next) => {
    const { type } = req.query;
    const filter = type ? { type } : {}; // If type is provided, filter by type

    const sections = await Section.find(filter)
        .populate([
            { path: "banner_id", select: "title imageUrl" },
            { path: "store_id", select: "name numberOfCoupons" },
            { path: "category_id", select: "name" },
        ])
        .sort({ order: 1 }); // Sort dynamically based on `order`

    res.status(200).json({
        message: `Sections retrieved successfully`,
        count: sections.length,
        sections,
    });
});
export default { getSection };