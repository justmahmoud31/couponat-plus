import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../../../database/Models/User.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { validateUser } from "../auth.validations.js";
import {
  generateOTP,
  createVerificationEmail,
  createPasswordResetEmail,
  createNewVerificationEmail,
} from "../../../Utils/authHelpers.js";
import { AppError } from "../../../Utils/AppError.js";
import sendEmail from "../../../Utils/SendEmail.js";

export const signup = catchError(async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;
  const profilePicture = req.file
    ? `uploads/user/${req.file.filename}`
    : undefined;
  const { error } = validateUser({
    username,
    email,
    password,
    phoneNumber,
    profilePicture,
  });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((err) => err.message),
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }

  // Handle profile picture upload

  // Generate OTP and set expiry
  const { otp, otpExpiry } = generateOTP();

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create HTML email content
  const htmlEmail = createVerificationEmail(username, otp);

  // Send OTP email
  await sendEmail(email, "التحقق من حسابك في كوبونات بلس", htmlEmail, true);

  // Create new user with OTP information and profile picture
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    phoneNumber,
    points: 0,
    otp: otp,
    otpExpiry: otpExpiry,
    isVerified: false,
    profilePicture,
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message:
      "User registered successfully. Please verify your email with the OTP sent.",
    userId: newUser._id,
  });
});

export const login = catchError(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  if (!user.isVerified) {
    const { otp, otpExpiry } = generateOTP();

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const htmlEmail = createNewVerificationEmail(user.username, otp);

    await sendEmail(user.email, "تفعيل الحساب", htmlEmail, true);

    return res.status(200).json({
      success: true,
      requireVerification: true,
      message: "Account not verified. Verification code sent to your email.",
      userId: user._id,
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  user.password = undefined;

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
      points: user.points,
    },
  });
});

export const verifyOTP = catchError(async (req, res) => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  // Find user by ID
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Check if OTP matches and is not expired
  if (user.otp !== otp || new Date() > user.otpExpiry) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  // Mark user as verified and clear OTP fields
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  // Generate JWT token for logged in session
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
    token,
  });
});

export const resendVerificationCode = catchError(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (user.isVerified) {
    return res
      .status(400)
      .json({ success: false, message: "This account is already verified" });
  }

  // Check resend attempts rate limiting
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // Initialize resendAttempts if it doesn't exist
  if (!user.resendAttempts) {
    user.resendAttempts = [];
  }

  // Filter attempts in the last hour
  const recentAttempts = user.resendAttempts.filter(
    (attempt) => new Date(attempt) > oneHourAgo
  );

  // Check if max attempts reached (5 per hour)
  if (recentAttempts.length >= 5) {
    return res.status(429).json({
      success: false,
      message: "Too many resend attempts. Please try again later.",
      nextAttemptAllowed: new Date(
        recentAttempts[0].getTime() + 60 * 60 * 1000
      ),
      attemptsRemaining: 0,
      totalAttempts: recentAttempts.length,
    });
  }

  // Check if last attempt was less than 30 seconds ago
  if (recentAttempts.length > 0) {
    const lastAttempt = new Date(recentAttempts[recentAttempts.length - 1]);
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);

    if (lastAttempt > thirtySecondsAgo) {
      const timeToWait = Math.ceil(
        (lastAttempt.getTime() + 30 * 1000 - now.getTime()) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${timeToWait} seconds before requesting another code`,
        nextAttemptAllowed: new Date(lastAttempt.getTime() + 30 * 1000),
        attemptsRemaining: 5 - recentAttempts.length,
        totalAttempts: recentAttempts.length,
        timeToWait: timeToWait,
      });
    }
  }

  const { otp, otpExpiry } = generateOTP();

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  user.resendAttempts = [...recentAttempts, now];
  await user.save();

  // Create HTML email content
  const htmlEmail = createNewVerificationEmail(user.username, otp);

  // Send OTP email
  await sendEmail(user.email, "رمز تحقق جديد - كوبونات بلس", htmlEmail, true);

  return res.status(200).json({
    success: true,
    message: "A new verification code has been sent to your email",
    userId: user._id,
    attemptsRemaining: 5 - user.resendAttempts.length,
    totalAttempts: user.resendAttempts.length,
    nextAttemptAllowed: new Date(now.getTime() + 30 * 1000),
  });
});

export const forgetPassword = catchError(async (req, res) => {
  const { email } = req.body;

  // Validate input
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or user does not exist",
    });
  }

  // Generate OTP for password reset
  const { otp, otpExpiry } = generateOTP();

  // Update user with password reset OTP
  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  // Create HTML email content
  const htmlEmail = createPasswordResetEmail(user.username, otp);

  // Send OTP email
  await sendEmail(
    user.email,
    "إعادة تعيين كلمة المرور - كوبونات بلس",
    htmlEmail,
    true
  );

  return res.status(200).json({
    success: true,
    message: "Password reset code has been sent to your email",
    userId: user._id,
  });
});

export const verifyForgetPasswordOtp = catchError(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (!user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "User is not verified",
    });
  }

  if (user.otp !== otp || new Date() > user.otpExpiry) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
});

export const resetPassword = catchError(async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email and new password are required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password has been reset successfully",
  });
});

export const addAdmin = catchError(async (req, res, next) => {
  const { username, email, password, phoneNumber } = req.body;
  const profilePicture = req.file
    ? `uploads/user/${req.file.filename}`
    : undefined;
  const { error } = validateUser({
    username,
    email,
    password,
    phoneNumber,
    profilePicture,
  });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((err) => err.message),
    });
  }
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create new user with OTP information
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    phoneNumber,
    isVerified: true,
    role: "admin",
    profilePicture,
  });

  return res.status(201).json({
    success: true,
    message: "Admin Added successfully",
    userId: newUser._id,
  });
});

export const deleteUser = catchError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new AppError("User Not Found", 404));
  }
  res.status(201).json({
    Message: "Deleted",
  });
});

export const promoteUserToAdmin = catchError(async (req, res, next) => {
  const { id } = req.params;

  // Find the user by ID
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check if the user is already an admin
  if (user.role === "admin") {
    return res
      .status(400)
      .json({ success: false, message: "User is already an admin" });
  }

  // Promote user to admin
  user.role = "admin";
  await user.save();

  return res.status(200).json({
    success: true,
    message: "User promoted to admin successfully",
  });
});

export const verifyLoginOTP = catchError(async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and OTP",
      });
    }

    // Find user by email
    const user = await User.findOne({
      email,
      otpExpires: { $gt: Date.now() },
    });

    // Check if user exists and OTP is valid
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found or OTP expired",
      });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      {
        expiresIn: process.env.JWT_EXPIRE || "30d",
      }
    );

    // Remove password from response
    user.password = undefined;

    // Send response
    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});
