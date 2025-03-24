import Rate from "../../../../database/Models/Rate.js";
import { Store } from "../../../../database/Models/Store.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

// Get All Rates
export const getAllRates = catchError(async (req, res) => {
    let { page = 1, limit = 10, sort = { createAt: -1 } } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    if (sort === "asc") {
        sort = { createdAt: 1 }
    } else if (sort === "desc") {
        sort = { createdAt: -1 }
    }
    const rates = await Rate.find()
        .populate({
            path: "user_id",
            select: "-password -otp -otpExpiry -points",
        })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

    const totalRates = await Rate.countDocuments();

    res.status(200).json({
        success: true,
        totalRates,
        totalPages: Math.ceil(totalRates / limit),
        currentPage: parseInt(page),
        data: rates,
    });
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
export const getStoreRates = catchError(async (req, res, next) => {
    const { id } = req.params;

    // Check if the store exists
    const store = await Store.findById(id);
    if (!store) {
        return next(new AppError("Store not found", 404));
    }

    // Fetch rates for the store
    const rates = await Rate.find({ store_id: id })
        .populate({
            path: "user_id",
            select: "username email", // Customize the user fields as needed
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        message: "Success",
        totalRates: rates.length,
        rates,
    });
});
