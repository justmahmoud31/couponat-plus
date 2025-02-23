import { Coupon } from "../../../../database/Models/Coupon.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
const getAllCopouns = catchError(async (req, res, next) => {
    const allCopouns = await Coupon.find();
    const copounsCount = allCopouns.length;
    res.status(200).json({
        Message: "Copouns retrived Successfully",
        copounsCount,
        allCopouns

    })
});
const getOneCopoun = catchError(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
        return next(new AppError("Coupon not found or Invalid Id", 400));
    }
    res.status(200).json({
        Message: "Copoun Found Successfully",
        coupon
    })
})
export { getAllCopouns, getOneCopoun };