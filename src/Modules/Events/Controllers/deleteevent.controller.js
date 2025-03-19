import path from "path";
import { Event } from "../../../../database/Models/Events.js";
import fs from "fs";

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the event
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Delete the cover image if it exists
        if (event.cover_img) {
            const imagePath = path.resolve(event.cover_img);
            fs.unlink(imagePath, err => {
                if (err) console.error(`Error deleting image: ${imagePath}`, err);
            });
        }

        // Delete the event from the database
        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: "Event deleted successfully" });

    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};