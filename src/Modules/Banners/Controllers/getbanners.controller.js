import { Banner } from "../../../../database/Models/Banner.js";
import { catchError } from "../../../Middlewares/catchError.js";

const getAllBanners = catchError(async (req, res, next) => {
    const allBanners = await Banner.find({}).sort({ craetedAt: -1 });
    const bannersCount = allBanners.length;
    res.status(200).json({
        Message: "Success",
        bannersCount,
        allBanners
    })
});
export { getAllBanners };