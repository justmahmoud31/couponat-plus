import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../../../database/Models/User.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { validateUser } from "../auth.validations.js";
export const signup = catchError(async (req, res) => {
    const { username, email, password, phoneNumber, role } = req.body;

    // Validate user input
    const { error } = validateUser({ username, email, password, phoneNumber, role });
    if (error) {
        return res.status(400).json({ success: false, message: error.details.map(err => err.message) });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        role,
        points: 0 // Default points
    });

    return res.status(201).json({ success: true, message: "User registered successfully", user: newUser });
});
export const login = catchError(async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            points: user.points
        }
    });
});
