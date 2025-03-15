import { User } from "../../../../database/Models/User.js";
import fs from "fs";
import path from "path";

// Helper to delete file with absolute path
const deleteFile = (filePath) => {
    const absolutePath = path.resolve(filePath);
    if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
    }
};

// Update User Profile Endpoint
export const updateUserProfile = async (req, res) => {
    try {
        const user_id = req.user._id;
        const { username, phoneNumber } = req.body;

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Handle profile picture replacement
        if (req.file) {
            if (user.profilePicture) deleteFile(user.profilePicture);
            user.profilePicture = req.file.path;
        }

        // Update other fields
        if (username) user.username = username;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};
