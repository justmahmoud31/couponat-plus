import mongoose from "mongoose";
// Update User Schema with profilePicture
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        unique: true,
        required: true,
        trim: true
    },
    email: { 
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String,
        required: true
    },
    phoneNumber: { 
        type: String,
        required: true
    },
    points: { 
        type: Number,
        default: 0
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    profilePicture: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const User = mongoose.model("User", userSchema);