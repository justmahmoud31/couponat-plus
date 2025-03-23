import { Banner } from "../../../../database/Models/Banner.js";
import { catchError } from "../../../Middlewares/catchError.js";

const getAllBanners = catchError(async (req, res, next) => {
    let { isActive, page = 1, limit = 20, sort = { createdAt: -1 } } = req.query;

    let filter = {};

    // Handle active/inactive filter
    if (isActive === "true") {
        filter.isActive = true;
    } else if (isActive === "false") {
        filter.isActive = false;
    }
    if (sort === "asc") {
        sort = { createdAt: -1 }
    } else if (sort === "desc") {
        sort = { createdAt: 1 }
    }
    // Convert page & limit to numbers
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 20;
    const skip = (pageNumber - 1) * limitNumber;

    // Count total banners
    const totalBanners = await Banner.countDocuments(filter);

    // Fetch paginated banners
    const banners = await Banner.find(filter)
        .sort(sort) // Sort by newest first
        .skip(skip)
        .limit(limitNumber);
    res.status(200).json({
        status: "Success",
        message: "Banners fetched successfully",
        totalBanners,
        totalPages: Math.ceil(totalBanners / limitNumber),
        page: pageNumber,
        banners,
    });
});
const getAllActiveBanners = catchError(async (req, res, next) => {
    const { page = 1, limit = 20 } = req.query;
    const filter = { isActive: true }

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
    res.status(200).json({
        status: "Success",
        message: "Banners fetched successfully",
        totalBanners,
        totalPages: Math.ceil(totalBanners / limitNumber),
        page: pageNumber,
        banners,
    });
});
export { getAllBanners, getAllActiveBanners };
