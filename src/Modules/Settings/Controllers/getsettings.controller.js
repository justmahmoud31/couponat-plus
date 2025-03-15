import { Settings } from "../../../../database/Models/Settings.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getSettings = catchError(async (req, res, next) => {
    const settings = await Settings.find();
    res.status(200).json({
        Message: "Success",
        settings
    })
})