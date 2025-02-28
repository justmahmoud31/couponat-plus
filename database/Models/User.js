import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    phoneNumber: { type: String },
    points: { type: Number },
    role: {
        type: String,
        enum: [
            "user",
            "admin"
        ],
        required: true
    }
});
export const User = mongoose.model("User", userSchema);