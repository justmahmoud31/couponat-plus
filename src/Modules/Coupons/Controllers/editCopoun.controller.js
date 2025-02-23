import fs from "fs-extra";
import path from "path";
import { Coupon } from "../../../../database/Models/Coupon.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const updateCoupon = catchError(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    // Find the coupon by ID
    const coupon = await Coupon.findById(id);
    if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
    }

    // Handle Image Replacement
    if (req.file) {
        // Delete old image if it exists
        if (coupon.image) {
            const oldImagePath = path.join(process.cwd, coupon.image);
            if (fs.existsSync(oldImagePath)) {
                await fs.unlink(oldImagePath);
            }
        }
        updateData.image = req.file.filename; // Save new image filename
    }

    // Update the coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: "Coupon updated successfully", coupon: updatedCoupon });
})
