import { User } from "../../../../database/Models/User.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getAllUsers = catchError(async (req, res, next) => {
    const allUsers = await User.find().sort({ createdAt: -1 });
    const usersCount = allUsers.length;
    res.status(200).json({
        Message: "Sucess",
        usersCount,
        allUsers
    })
});
export const getUserData = catchError(async (req, res, next) => {
    const user_id = req.user._id;
    const user = await User.findById(user_id).select('-password -points -otp -otpExpiry -isVerified');
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

