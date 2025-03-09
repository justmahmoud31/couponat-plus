import fs from "fs";
import path from "path";
import { Banner } from "../../../../database/Models/Banner.js";
import { catchError } from "../../../Middlewares/catchError.js";

const deleteBanner = catchError(async (req, res, next) => {
    const { id } = req.params;

    // Find the banner by ID
    const banner = await Banner.findById(id);
    if (!banner) {
        return res.status(404).json({ message: "Banner not found." });
    }

    // Delete image files from the server
    if (banner.images && banner.images.length > 0) {
        banner.images.forEach((imagePath) => {
            const fullPath = path.join(process.cwd(), imagePath); // Get absolute path
            
            // Check if file exists before deleting
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        });
    }

    // Remove the banner from the database
    await Banner.findByIdAndDelete(id);

    res.status(200).json({ message: "Banner deleted successfully." });
});

export { deleteBanner };
