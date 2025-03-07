import { Coupon } from "../../../../database/Models/Coupon.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

const deleteCoupon = catchError(async (req, res, next) => {
    const { id } = req.params;
    const { ids } = req.body;

    if (ids && Array.isArray(ids) && ids.length > 0) {
        // ✅ Delete multiple coupons
        const result = await Coupon.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) {
            return next(new AppError("No coupons found with the provided IDs.", 404));
        }

        return res.status(200).json({
            success: true,
            message: `${result.deletedCount} coupons deleted successfully.`,
        });
    }

    if (id) {
        // ✅ Delete single coupon
        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return next(new AppError("Coupon not found or Invalid Id.", 404));
        }

        return res.status(200).json({
            success: true,
            message: "Coupon deleted successfully.",
        });
    }

    return res.status(400).json({
        success: false,
        message: "Please provide either a valid 'id' parameter or an 'ids' array in the request body.",
    });
});

export { deleteCoupon };