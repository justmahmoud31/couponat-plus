import { User } from "../../../../database/Models/User.js";
import fs from "fs";
const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// Update User Profile Endpoint
export const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phoneNumber } = req.body;

        const user = await User.findById(id);
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
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};
