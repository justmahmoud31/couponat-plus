import { Section } from "../../../../database/Models/Section.js";

export const deleteSection = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the section exists
        const section = await Section.findById(id);
        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        // Delete the section
        await Section.findByIdAndDelete(id);

        return res.status(200).json({ message: "Section deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
