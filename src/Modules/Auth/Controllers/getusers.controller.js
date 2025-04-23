import { User } from "../../../../database/Models/User.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getAllUsers = catchError(async (req, res, next) => {
  const allUsers = await User.find()
    .select("-password -otp -otpExpiry")
    .sort({ createdAt: -1 });

  const usersCount = allUsers.length;

  res.status(200).json({
    Message: "Success",
    usersCount,
    allUsers,
  });
});

export const getUserData = catchError(async (req, res, next) => {
  const user_id = req.user._id;
  const user = await User.findById(user_id).select(
    "-password -points -otp -otpExpiry -isVerified"
  );
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  res.status(200).json({
    message: "Success",
    data: user,
  });
});

// Get a single user by ID (for admin edit)
export const getUserById = catchError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password -otp -otpExpiry");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Success",
    user,
  });
});
