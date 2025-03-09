import Rate from "../../../../database/Models/Rate.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const deleteRate = catchError(async (req, res) => {
    const deletedRate = await Rate.findByIdAndDelete(req.params.id);
    if (!deletedRate) {
        return res.status(404).json({ success: false, message: "Rate not found" });
    }
    res.status(200).json({ success: true, message: "Rate deleted successfully" });
});