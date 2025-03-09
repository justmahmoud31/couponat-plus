import { Coupon } from "../../../../database/Models/Coupon.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
const getAllCopouns = catchError(async (req, res, next) => {
    const allCoupons = await Coupon.find().sort({ createdAt: -1 }); // Sorting by newest first
    const couponsCount = allCoupons.length;

    res.status(200).json({
        message: "Coupons retrieved successfully",
        couponsCount,
        allCoupons
    });
});

const getOneCopoun = catchError(async (req, res, next) => {
    const { id } = req.params;

    let coupon = await Coupon.findById(id)
        .populate("category_id", "name") // ✅ Get only the name
        .populate("store_id");

    if (!coupon) {
        return next(new AppError("Coupon not found or Invalid Id", 400));
    }

    // ✅ Fetch related coupons (same category or same store), excluding itself
    const relatedCoupons = await Coupon.find({
        _id: { $ne: coupon._id }, // Exclude the current coupon
        $or: [
            { category_id: coupon.category_id?._id },
            { store_id: coupon.store_id?._id }
        ]
    })
    .populate("category_id", "name") // ✅ Get only the name
    .populate("store_id");

    // ✅ Convert coupon to object to allow adding a new property
    coupon = coupon.toObject();
    coupon.relatedCoupons = relatedCoupons;

    res.status(200).json({
        message: "Coupon found successfully",
        coupon
    });
});


export { getAllCopouns, getOneCopoun };