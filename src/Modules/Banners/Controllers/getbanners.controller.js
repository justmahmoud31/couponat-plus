import { Banner } from "../../../../database/Models/Banner.js";
import { catchError } from "../../../Middlewares/catchError.js";

const getAllBanners = catchError(async (req, res, next) => {
    const { isActive, page = 1, limit = 20 } = req.query;

    let filter = {};

    // Handle active/inactive filter
    if (isActive === "true") {
        filter.isActive = true;
    } else if (isActive === "false") {
        filter.isActive = false;
    }

    // Convert page & limit to numbers
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 20;
    const skip = (pageNumber - 1) * limitNumber;

    // Count total banners
    const totalBanners = await Banner.countDocuments(filter);

    // Fetch paginated banners
    const banners = await Banner.find(filter)
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limitNumber);
    const allBanners = await Banner.find();
    const bannerCount = allBanners.length
    res.status(200).json({
        status: "Success",
        message: "Banners fetched successfully",
        bannerCount,
        totalBanners,
        totalPages: Math.ceil(totalBanners / limitNumber),
        currentPage: pageNumber,
        banners,
    });
});

export { getAllBanners };
