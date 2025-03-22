import { Section } from "../../../../database/Models/Section.js";
import { Category } from "../../../../database/Models/Category.js";
import { Coupon } from "../../../../database/Models/Coupon.js";
import { Store } from "../../../../database/Models/Store.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { Product } from "../../../../database/Models/Product.js";
import { Event } from "../../../../database/Models/Events.js";

const getSection = catchError(async (req, res, next) => {
    const { type, isActive } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    let sections = await Section.find(filter)
        .populate([
            { path: "banner_id", select: "title imageUrl" },
            { path: "store_id", select: "name numberOfCoupons" },
            { path: "category_id", select: "name" },
        ])
        .sort({ order: 1 });

    // Populate `items` dynamically based on the section type
    sections = await Promise.all(sections.map(async (section) => {
        if (["Categories", "Coupons", "Stores", "Products", "Events"].includes(section.type) && section.items && section.items.length) {
            let itemsData = [];
            if (section.type === "Categories") {
                itemsData = await Category.find({ _id: { $in: section.items } }, "name imageUrl");
            } else if (section.type === "Coupons") {
                itemsData = await Coupon.find({ _id: { $in: section.items } }, "code title cover_image");
            } else if (section.type === "Stores") {
                itemsData = await Store.find({ _id: { $in: section.items } }, "name logo numberOfCoupons");
            } else if (section.type === "Products") {
                itemsData = await Product.find({ _id: { $in: section.items } }, "cover_image price")
            } else if (section.type === "Events") {
                itemsData = await Event.find({ _id: { $in: section.items } }, "cover_image name link")
            }
            return { ...section.toObject(), items: itemsData };
        }
        return section;
    }));

    res.status(200).json({
        message: "Sections retrieved successfully",
        count: sections.length,
        sections,
    });
});
const getActiveSections = catchError(async (req, res, next) => {
    const { type } = req.query;
    const filter = { isActive: true }; // Only fetch active sections
    if (type) filter.type = type;

    let sections = await Section.find(filter)
        .populate([
            { path: "banner_id", select: "title imageUrl" },
            { path: "store_id", select: "name numberOfCoupons" },
            { path: "category_id", select: "name" },
        ])
        .sort({ order: 1 });

    // Populate `items` dynamically based on the section type
    sections = await Promise.all(sections.map(async (section) => {
        if (["Categories", "Coupons", "Stores", "Products", "Events"].includes(section.type) && section.items?.length) {
            let itemsData = [];
            if (section.type === "Categories") {
                itemsData = await Category.find({ _id: { $in: section.items } }, "name imageUrl");
            } else if (section.type === "Coupons") {
                itemsData = await Coupon.find({ _id: { $in: section.items } }, "code title cover_image");
            } else if (section.type === "Stores") {
                itemsData = await Store.find({ _id: { $in: section.items } }, "name logo numberOfCoupons");
            } else if (section.type === "Products") {
                itemsData = await Product.find({ _id: { $in: section.items } }, "cover_image price");
            } else if (section.type === "Events") {
                itemsData = await Event.find({ _id: { $in: section.items } }, "cover_image name link");
            }
            return { ...section.toObject(), items: itemsData };
        }
        return section;
    }));

    res.status(200).json({
        message: "Active sections retrieved successfully",
        count: sections.length,
        sections,
    });
});

export default { getSection, getActiveSections };
