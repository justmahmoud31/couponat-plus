import { BannerText } from "../../../../database/Models/BannerText.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getbannerText = catchError(async (req, res, next) => {
    const bannerTexts = await BannerText.find();
    
})