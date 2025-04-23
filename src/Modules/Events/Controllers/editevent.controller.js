import path from "path";
import { Event } from "../../../../database/Models/Events.js";
import fs from "fs";
export const editEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, link, isActive, cover_img_path } = req.body;
    const newCoverImg = req.file?.path; 

    // Find the existing event
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // If new cover image is uploaded, delete the old one
    if (newCoverImg && event.cover_img) {
      const oldImagePath = path.resolve(event.cover_img);
      fs.unlink(oldImagePath, (err) => {
        if (err)
          console.error(`Error deleting old image: ${oldImagePath}`, err);
      });
    }

    // Update the event fields
    event.name = name || event.name;
    event.link = link || event.link;
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
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
