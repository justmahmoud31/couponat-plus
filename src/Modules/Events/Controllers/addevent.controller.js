import { Event } from "../../../../database/Models/Events.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const adddevent = catchError(async (req, res, next) => {
    const { name, link } = req.body;
    const cover_img = req.file ? req.file.path : null;

    const newEvent = new Event({ name, link, cover_img });
    await newEvent.save();

    res.status(201).json({ message: "Event created successfully", data: newEvent });
})