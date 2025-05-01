import path from "path";
import { Event } from "../../../../database/Models/Events.js";
import fs from "fs";
import mongoose from "mongoose";
import { catchError } from "../../../Middlewares/catchError.js";

export const editEvent = catchError(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    link,
    isActive,
    cover_img_path,
    category_id,
    eventDate,
    location,
    organizer,
    highlightText,
  } = req.body;
  const newCoverImg = req.file?.path;

  // Find the existing event
  const event = await Event.findById(id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Validate category ID if provided
  if (category_id && !mongoose.Types.ObjectId.isValid(category_id)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  // If new cover image is uploaded, delete the old one
  if (newCoverImg && event.cover_img) {
    const oldImagePath = path.resolve(event.cover_img);
    fs.unlink(oldImagePath, (err) => {
      if (err) console.error(`Error deleting old image: ${oldImagePath}`, err);
    });
  }

  // Update the event fields
  event.name = name || event.name;
  event.link = link || event.link;

  // Update additional fields if provided
  if (description !== undefined) event.description = description;
  if (category_id !== undefined) event.category_id = category_id;
  if (eventDate !== undefined) event.eventDate = eventDate;
  if (location !== undefined) event.location = location;
  if (organizer !== undefined) event.organizer = organizer;
  if (highlightText !== undefined) event.highlightText = highlightText;

  // Properly handle boolean isActive, using undefined check
  event.isActive = isActive !== undefined ? isActive : event.isActive;

  // Update cover_img if a new file was uploaded
  if (newCoverImg) {
    event.cover_img = newCoverImg;
  }
  // Use cover_img_path if provided and no new file
  else if (cover_img_path) {
    event.cover_img = cover_img_path;
  }

  await event.save();
  res.status(200).json({ message: "Event updated successfully", event });
});
