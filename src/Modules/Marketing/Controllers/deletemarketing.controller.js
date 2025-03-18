import Marketing from "../../../../database/Models/Marketing.js";
import { catchError } from "../../../Middlewares/catchError.js"

export const deleteMarketingSection = catchError(async (req, res, next) => {

    const section = await Marketing.findOne();
    if (!section) return res.status(404).json({ message: "Section not found" });

    await Marketing.deleteOne();
    res.json({ message: "Section deleted successfully" });

})