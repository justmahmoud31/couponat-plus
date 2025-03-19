import { Navigation } from "../../../../database/Models/Navigation.js";


export const deleteNavigation = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the navigation item to be deleted
        const navigation = await Navigation.findById(id);
        if (!navigation) {
            return res.status(404).json({ message: "Navigation item not found" });
        }

        const { sort_order } = navigation; // Store current sort order before deletion

        // Delete the navigation item
        await Navigation.findByIdAndDelete(id);

        // Adjust the sort_order of remaining navigation items
        await Navigation.updateMany(
            { sort_order: { $gt: sort_order } }, // Find items with a higher sort order
            { $inc: { sort_order: -1 } } // Decrement sort_order to fill the gap
        );

        res.status(200).json({ message: "Navigation item deleted successfully and sort order updated" });

    } catch (error) {
        console.error("Error deleting navigation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
