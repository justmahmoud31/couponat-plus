import { User } from "../../../../database/Models/User.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getAllUsers = catchError(async (req, res, next) => {
    const allUsers = await User.find();
    const usersCount = allUsers.length;
    res.status(200).json({
        Message: "Sucess",
        usersCount,
        allUsers
    })
})