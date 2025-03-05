import { Store } from "../../../../database/Models/Store.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

export const getAllStores = catchError(async (req, res, next) => {
    const { isDeleted } = req.query;

    let filter = {};
    if (isDeleted === "true") {
        filter.isDeleted = true;
    } else if (isDeleted === "false") {
        filter.isDeleted = false;
    }

    const stores = await Store.find(
        filter,
        'logo name description rate numberOfCoupons'
    ).sort({ createdAt: -1 });

    res.status(200).json({
        message: "Success",
        totalStores: stores.length,
        stores
    });
});


export const getOneStore = catchError(async (req, res, next) => {
    const oneStore = await Store.findById(req.params.id);
    if (!oneStore) {
        return next(new AppError("Store Not Found", 404));
    }
    await oneStore.populate(['categories', 'coupons']);
    res.status(200).json({
        Message: "Success",
        oneStore
    })
})
