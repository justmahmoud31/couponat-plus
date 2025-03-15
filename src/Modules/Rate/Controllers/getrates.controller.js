import Rate from "../../../../database/Models/Rate.js";
import { catchError } from "../../../Middlewares/catchError.js";

// Get All Rates
export const getAllRates = catchError(async (req, res) => {
    const rates = await Rate.find().populate({
        path: "user_id",
        select: "-password -otp -otpExpiry -points",
    });
    
    res.status(200).json({ success: true, data: rates });
});

// Get Single Rate by ID
export const getRateById = catchError(async (req, res) => {
    const rate = await Rate.findById(req.params.id).populate({
        path: "user_id",
        select: "-password -otp -otpExpiry -points",
    });

    if (!rate) {
        return res.status(404).json({ success: false, message: "Rate not found" });
    }

    res.status(200).json({ success: true, data: rate });
});
