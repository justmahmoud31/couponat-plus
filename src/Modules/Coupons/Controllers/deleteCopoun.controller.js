import { Coupon } from "../../../../database/Models/Coupon.js";
import { Category } from "../../../../database/Models/Category.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";
import fs from "fs";
import path from "path";

const deleteImage = (filePath) => {
    if (filePath) {
        const fullPath = path.join(process.cwd(), "uploads", filePath.replace(/\\/g, "/").split("/").slice(1).join("/"));
        fs.unlink(fullPath, (err) => {
            if (err) console.log("Failed to delete image:", fullPath, err.message);
        });
    }
};

export const deleteOneCoupon = catchError(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new AppError("Coupon Id is required", 400));
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
        return next(new AppError("Coupon Not Found", 404));
    }

    // Delete coupon images
    deleteImage(coupon.image);
    deleteImage(coupon.cover_image);

    // Delete the coupon
    await Coupon.findByIdAndDelete(id);

    // Update the related category's count
    if (coupon.category) {
        const totalCoupons = await Coupon.countDocuments({ category: coupon.category });
        const totalProducts = await Category.countDocuments({ category: coupon.category });
        const totalStores = await Category.countDocuments({ category: coupon.category });

        const totalCount = totalProducts + totalCoupons + totalStores;

        await Category.findByIdAndUpdate(coupon.category, {
            count: totalCount,
        });
    }

    res.status(200).json({
        success: true,
        message: "Coupon deleted successfully",
    });
});

const deleteCoupon = catchError(async (req, res, next) => {
    const { ids } = req.body;

    if (ids && Array.isArray(ids) && ids.length > 0) {
        // ✅ Find coupons to delete their images first
        const coupons = await Coupon.find({ _id: { $in: ids } });

        if (coupons.length === 0) {
            return next(new AppError("No coupons found with the provided IDs.", 404));
        }

        // ✅ Delete images
        coupons.forEach((coupon) => {
            deleteImage(coupon.image);
            deleteImage(coupon.cover_image);
        });

        // ✅ Delete coupons
        const result = await Coupon.deleteMany({ _id: { $in: ids } });

        return res.status(200).json({
            success: true,
            message: `${result.deletedCount} coupons deleted successfully.`,
        });
    }
    if (id) {
        // ✅ Find coupon first to delete images
        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return next(new AppError("Coupon not found or Invalid Id.", 404));
        }

        deleteImage(coupon.image);
        deleteImage(coupon.cover_image);

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
