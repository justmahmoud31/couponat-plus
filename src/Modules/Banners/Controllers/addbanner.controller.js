import { Banner } from "../../../../database/Models/Banner.js";
import { catchError } from "../../../Middlewares/catchError.js";

const addBanner = catchError(async (req, res, next) => {
    const { title, type, description } = req.body;

    // Validate required fields
    if (!title || !type) {
        return res.status(400).json({ message: "Title and type are required." });
    }

    // Validate type
    const validTypes = ["slider", "static", "two", "bannerText"];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid banner type." });
    }

    // Ensure files are extracted correctly
    const imagePaths = req.files && req.files.images ? req.files.images.map(file => file.path) : [];

    // Create new banner with image paths
    const newBanner = new Banner({
        title,
        images: imagePaths, // Store image paths in array
        type,
        description,
        isActive: "true"
    });

    // Save to database
    await newBanner.save();

    res.status(201).json({ message: "Banner added successfully.", banner: newBanner });
});

export { addBanner };
