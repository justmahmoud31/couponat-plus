import Rate from "../../../../database/Models/Rate.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { validateRate } from "../rate.validation.js";

export const createRate = catchError(async (req, res) => {
    const { error } = validateRate(req.body);
    if (error) {
        return res.status(400).json({ success: false, errors: error.details.map(err => err.message) });
    }
    const { store_id, rateNumber, comment } = req.body;
    const user_id = req.user._id; // Extracted from token


    // Check if the user has already rated the store
    const existingRate = await Rate.findOne({ store_id, user_id });
    if (existingRate) {
        return res.status(400).json({ success: false, message: "You have already rated this store." });
    }

    const rate = await Rate.create({
        rateNumber,
        comment,
        store_id,
        user_id
    });

    res.status(201).json({ success: true, message: "Rate added successfully", data: rate });
});
