import { Banner } from "../../../../database/Models/Banner.js";
import { catchError } from "../../../Middlewares/catchError.js";

const addBanner = catchError(async (req, res, next) => {
    const { title, type } = req.body;

    // Validate required fields
    if (!title || !type) {
        return res.status(400).json({ message: "Title and type are required." });
    }

    // Validate type
    const validTypes = ["slider", "static", "two"];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid banner type." });
    }

    // Extract image path from Multer (single file upload)
    const imagePath = req.file ? req.file.path : null;

    // Create new banner with image path
    const newBanner = new Banner({ 
        title, 
        images: imagePath ? [imagePath] : [], // Store image in array
        type 
    });

    // Save to database
    await newBanner.save();

    res.status(201).json({ message: "Banner added successfully.", banner: newBanner });
});

export { addBanner };
