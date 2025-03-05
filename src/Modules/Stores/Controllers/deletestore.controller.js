import { Store } from "../../../../database/Models/Store.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

export const deleteStore = catchError(async (req, res, next) => {
    const oneStore = await Store.findById(req.params.id);
    if (!oneStore) {
        return next(new AppError("Store Not Found", 404));
    }
    oneStore.isDeleted = true;
    await oneStore.save(); 
    res.status(201).json({
        Message: "Success"
    })
})