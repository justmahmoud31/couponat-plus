import { Event } from "../../../../database/Models/Events.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getAllEvents = catchError(async (req, res, next) => {
    const allEvents = await Event.find({}).sort({ createdAt: -1 });
    const eventsCount = allEvents.length;
    res.status(200).json({
        Message: "success",
        eventsCount,
        allEvents
    })
})