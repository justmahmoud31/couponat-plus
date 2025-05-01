import { Event } from "../../../../database/Models/Events.js";
import { catchError } from "../../../Middlewares/catchError.js";
import mongoose from "mongoose";

export const adddevent = catchError(async (req, res, next) => {
  const {
    name,
    description,
    link,
    isActive,
    category_id,
    eventDate,
    location,
    organizer,
    highlightText,
  } = req.body;

  const cover_img = req.file ? req.file.path : null;

  // Validate category ID if provided
  if (category_id && !mongoose.Types.ObjectId.isValid(category_id)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  const newEvent = new Event({
    name,
    description,
    link,
    cover_img,
    isActive: isActive !== undefined ? isActive : true,
    category_id: category_id || undefined,
    eventDate: eventDate || undefined,
    location,
    organizer,
    highlightText,
  });

  await newEvent.save();

  res.status(201).json({
    message: "Event created successfully",
    event: newEvent,
  });
});
