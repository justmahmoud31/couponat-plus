import { Navigation } from "../../../../database/Models/Navigation.js";


export const editNavigation = async (req, res) => {
    try {
        const { id } = req.params;
        const { label, sort_order, isActive } = req.body;

        // Find the navigation item by ID
        const navigation = await Navigation.findById(id);
        if (!navigation) {
            return res.status(404).json({ message: "Navigation item not found" });
        }

        // Update fields if provided
        if (label !== undefined) navigation.label = label;
        if (sort_order !== undefined) navigation.sort_order = sort_order;
        if (isActive !== undefined) navigation.isActive = isActive;
        await navigation.save();

        res.status(200).json({ message: "Navigation item updated successfully", navigation });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
