import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    phoneNumber: { type: String },
    points: { type: Number },
});
export const User = mongoose.model("User", userSchema);