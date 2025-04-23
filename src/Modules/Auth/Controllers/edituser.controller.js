import { User } from "../../../../database/Models/User.js";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { catchError } from "../../../Middlewares/catchError.js";

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
    res
      .status(200)
      .json({ message: "Profile updated successfully", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

// Admin endpoint to edit users
export const adminEditUser = catchError(async (req, res) => {
  const { id } = req.params;
  const { username, email, phoneNumber, password, role } = req.body;

  // Find the user
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Update fields if provided
  if (username) user.username = username;
  if (email) user.email = email;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (role) user.role = role;

  // Only update password if provided
  if (password && password.trim() !== "") {
    user.password = await bcrypt.hash(password, 10);
  }

  // Handle profile picture replacement
  if (req.file) {
    if (user.profilePicture) deleteFile(user.profilePicture);
    user.profilePicture = req.file.path;
  }

  // Save the updated user
  await user.save();

  // Return user without password
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: userWithoutPassword,
  });
});
