import { Event } from "../../../../database/Models/Events.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getAllEvents = catchError(async (req, res, next) => {
    let { isActive, page = 1, limit = 10, sort = { createdAt: -1 } } = req.query;

    let filter = {};
    // Handle active/inactive filter
    if (isActive === "true") {
        filter.isActive = true;
    } else if (isActive === "false") {
        filter.isActive = false;
    }

    if (sort === "asc") {
        sort = { createdAt: 1 }
    } else if (sort === "desc") {
        sort = { createdAt: -1 }
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get paginated and sorted events
    const allEvents = await Event.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

    const eventsCount = await Event.countDocuments(filter);

    res.status(200).json({
        message: "success",
        eventsCount,
        totalPages: Math.ceil(eventsCount / limit),
        currentPage: parseInt(page),
        allEvents
    });
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