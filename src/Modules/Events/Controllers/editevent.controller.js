import path from "path";
import { Event } from "../../../../database/Models/Events.js";
import fs from "fs";
export const editEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, link, isActive } = req.body;
        const newCoverImg = req.file?.path; // Assuming file upload middleware

        // Find the existing event
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // If new cover image is uploaded, delete the old one
        if (newCoverImg && event.cover_img) {
            const oldImagePath = path.resolve(event.cover_img);
            fs.unlink(oldImagePath, err => {
                if (err) console.error(`Error deleting old image: ${oldImagePath}`, err);
            });
        }

        // Update the event fields
        event.name = name || event.name;
        event.link = link || event.link;
        event.isActive = isActive || event.isActive;
        if (newCoverImg) {
            event.cover_img = newCoverImg;
        }

        await event.save();
        res.status(200).json({ message: "Event updated successfully", event });

    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};