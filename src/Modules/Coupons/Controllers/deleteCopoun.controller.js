import { Coupon } from "../../../../database/Models/Coupon.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

const deleteCopoun = catchError(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
        return next(new AppError("Coupon not found or Invalid Id", 400));
    }
    res.status(201).json({
        Message: "Success",
    })
});
export { deleteCopoun };