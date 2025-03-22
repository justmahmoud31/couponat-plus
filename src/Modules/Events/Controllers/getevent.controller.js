import { Event } from "../../../../database/Models/Events.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getAllEvents = catchError(async (req, res, next) => {
    const { isActive } = req.query;
    let filter = {};
    // Handle active/inactive filter
    if (isActive === "true") {
        filter.isActive = true;
    } else if (isActive === "false") {
        filter.isActive = false;
    }
    const allEvents = await Event.find(filter).sort({ createdAt: -1 });
    const eventsCount = allEvents.length;
    res.status(200).json({
        Message: "success",
        eventsCount,
        allEvents
    })
});
export const getAllActiveEvents = catchError(async (req, res, next) => {
    const filter = { isActive: true }
    const allEvents = await Event.find(filter).sort({ createdAt: -1 });
    const eventsCount = allEvents.length;
    res.status(200).json({
        Message: "success",
        eventsCount,
        allEvents
    })
})