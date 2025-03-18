import { Navigation } from "../../../../database/Models/Navigation.js";

export const getAllNavigations = async (req, res) => {
    try {
        const navigations = await Navigation.find().populate("category", "name slug");
        res.status(200).json({
            Message: "Success",
            navigations
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getNavigationById = async (req, res) => {
    try {
        const navigation = await Navigation.findById(req.params.id).populate("category", "name slug");
        if (!navigation) return res.status(404).json({ error: "Navigation not found" });
        res.status(200).json({
            Message: "Success",
            navigation
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};