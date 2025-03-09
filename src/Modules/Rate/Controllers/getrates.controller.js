import Rate from "../../../../database/Models/Rate.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getAllRates = catchError(async (req, res) => {
    const rates = await Rate.find().populate("user_id");
    res.status(200).json({ success: true, data: rates });
});

// Get Single Rate
export const getRateById = catchError(async (req, res) => {
    const rate = await Rate.findById(req.params.id).populate("user_id");
    if (!rate) {
        return res.status(404).json({ success: false, message: "Rate not found" });
    }
    res.status(200).json({ success: true, data: rate });
});