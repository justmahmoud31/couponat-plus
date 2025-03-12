import { BannerText } from "../../../../database/Models/BannerText.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const addBannerText = catchError(async (req, res, next) => {
    const { error } = bannerTextValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const img = req.file ? req.file.path : null;
    const newBannerText = new BannerText({
        ...req.body,
        img,
    });
    await newBannerText.save();
    res.status(201).json({ message: "BannerText created successfully", data: newBannerText });
})