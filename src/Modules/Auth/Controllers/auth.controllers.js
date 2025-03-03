import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../../../database/Models/User.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { validateUser } from "../auth.validations.js";
import sendEmail from "../../../Utils/SendEmail.js";
import { AppError } from "../../../Utils/AppError.js";
export const signup = catchError(async (req, res) => {
    const { username, email, password, phoneNumber } = req.body;

    // Validate user input
    const { error } = validateUser({ username, email, password, phoneNumber });
    if (error) {
        return res.status(400).json({ success: false, message: error.details.map(err => err.message) });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiry (15 minutes from now)
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create HTML email content in Arabic
    const htmlEmail = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>التحقق من البريد الإلكتروني - كوبونات بلس</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                direction: rtl;
                text-align: right;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            }
            .header {
                text-align: center;
                padding: 20px 0;
                border-bottom: 1px solid #eee;
            }
            .logo {
                max-width: 180px;
                height: auto;
            }
            .content {
                padding: 20px 0;
            }
            .otp-container {
                background-color: #f5f5f5;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                text-align: center;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 5px;
                color: #0066cc;
            }
            .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #999;
            }
            .button {
                display: inline-block;
                background-color: #0066cc;
                color: white !important;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 4px;
                font-weight: bold;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>كوبونات بلس</h1>
            </div>
            <div class="content">
                <h2>مرحباً ${username}،</h2>
                <p>شكراً للتسجيل في موقع كوبونات بلس. للمتابعة، يرجى التحقق من بريدك الإلكتروني باستخدام رمز التحقق التالي:</p>
                
                <div class="otp-container">
                    <p>رمز التحقق الخاص بك هو:</p>
                    <div class="otp-code">${otp}</div>
                    <p>صالح لمدة 15 دقيقة فقط</p>
                </div>
                
                <p>إذا لم تقم بالتسجيل في موقع كوبونات بلس، يمكنك تجاهل هذا البريد الإلكتروني.</p>
                
                <p>نتطلع إلى مساعدتك في الحصول على أفضل العروض والخصومات!</p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} كوبونات بلس. جميع الحقوق محفوظة.</p>
                <p>هذا بريد إلكتروني تلقائي، يرجى عدم الرد عليه.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Send OTP email
    await sendEmail(
        email,
        "التحقق من حسابك في كوبونات بلس",
        htmlEmail,
        true // Set isHtml to true
    );

    // Create new user with OTP information
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        points: 0, // Default points
        otp: otp,
        otpExpiry: otpExpiry,
        isVerified: false // Account not verified yet
    });

    return res.status(201).json({
        success: true,
        message: "User registered successfully. Please verify your email with the OTP sent.",
        userId: newUser._id // Send only the ID for security
    });
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

    // Check if user is verified
    if (!user.isVerified) {
        return res.status(403).json({
            success: false,
            message: "Your email is not verified. Please check your email for the verification code or request a new one.",
            requiresVerification: true,
            userId: user._id
        });
    }

    // Generate JWT token for verified user
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
export const verifyOTP = catchError(async (req, res) => {
    const { userId, otp } = req.body;

    // Validate input
    if (!userId || !otp) {
        return res.status(400).json({
            success: false,
            message: "User ID and OTP are required"
        });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || new Date() > user.otpExpiry) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired OTP"
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
        { expiresIn: '7d' }
    );

    return res.status(200).json({
        success: true,
        message: "Email verified successfully",
        token
    });
});
export const resendVerificationCode = catchError(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
        return res.status(400).json({ success: false, message: "This account is already verified" });
    }

    // Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiry (15 minutes from now)
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

    // Update user with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Create HTML email content in Arabic
    const htmlEmail = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>رمز تحقق جديد - كوبونات بلس</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                direction: rtl;
                text-align: right;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            }
            .header {
                text-align: center;
                padding: 20px 0;
                border-bottom: 1px solid #eee;
            }
            .content {
                padding: 20px 0;
            }
            .otp-container {
                background-color: #f5f5f5;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                text-align: center;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 5px;
                color: #0066cc;
            }
            .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>كوبونات بلس</h1>
            </div>
            <div class="content">
                <h2>مرحباً ${user.username}،</h2>
                <p>تم إنشاء رمز تحقق جديد لحسابك. يرجى استخدام الرمز التالي للتحقق من بريدك الإلكتروني:</p>
                
                <div class="otp-container">
                    <p>رمز التحقق الجديد هو:</p>
                    <div class="otp-code">${otp}</div>
                    <p>صالح لمدة 15 دقيقة فقط</p>
                </div>
                
                <p>نتطلع إلى مساعدتك في الحصول على أفضل العروض والخصومات!</p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} كوبونات بلس. جميع الحقوق محفوظة.</p>
                <p>هذا بريد إلكتروني تلقائي، يرجى عدم الرد عليه.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Send OTP email
    await sendEmail(
        user.email,
        "رمز تحقق جديد - كوبونات بلس",
        htmlEmail,
        true // Set isHtml to true
    );

    return res.status(200).json({
        success: true,
        message: "A new verification code has been sent to your email",
        userId: user._id
    });
});
export const forgetPassword = catchError(async (req, res, next) => {
    const { email } = req.body;
    
    // Validate input
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or user does not exist" });
    }
    
    // Generate 6-digit OTP for password reset
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP expiry (15 minutes from now)
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);
    
    // Update user with password reset OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    
    // Create HTML email content in Arabic
    const htmlEmail = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>إعادة تعيين كلمة المرور - كوبونات بلس</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                direction: rtl;
                text-align: right;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            }
            .header {
                text-align: center;
                padding: 20px 0;
                border-bottom: 1px solid #eee;
            }
            .logo {
                max-width: 180px;
                height: auto;
            }
            .content {
                padding: 20px 0;
            }
            .otp-container {
                background-color: #f5f5f5;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                text-align: center;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 5px;
                color: #0066cc;
            }
            .warning {
                color: #cc0000;
                font-weight: bold;
                margin: 15px 0;
            }
            .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>كوبونات بلس</h1>
            </div>
            <div class="content">
                <h2>مرحباً ${user.username}،</h2>
                <p>لقد تلقينا طلبًا لإعادة تعيين كلمة المرور لحسابك. إذا لم تقم بطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.</p>
                
                <div class="otp-container">
                    <p>رمز إعادة تعيين كلمة المرور الخاص بك هو:</p>
                    <div class="otp-code">${otp}</div>
                    <p>صالح لمدة 15 دقيقة فقط</p>
                </div>
                
                <p class="warning">إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تأمين حسابك فوراً بتغيير كلمة المرور.</p>
                
                <p>شكراً لاستخدامك كوبونات بلس.</p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} كوبونات بلس. جميع الحقوق محفوظة.</p>
                <p>هذا بريد إلكتروني تلقائي، يرجى عدم الرد عليه.</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    // Send OTP email
    await sendEmail(
        user.email,
        "إعادة تعيين كلمة المرور - كوبونات بلس",
        htmlEmail,
        true // Set isHtml to true
    );
    
    return res.status(200).json({
        success: true,
        message: "Password reset code has been sent to your email",
        userId: user._id
    });
});

// Add a reset password endpoint to complete the process
export const resetPassword = catchError(async (req, res) => {
    const { userId, otp, newPassword } = req.body;
    
    // Validate input
    if (!userId || !otp || !newPassword) {
        return res.status(400).json({ 
            success: false, 
            message: "User ID, OTP, and new password are required" 
        });
    }
    
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ 
            success: false, 
            message: "User not found" 
        });
    }
    
    // Check if OTP matches and is not expired
    if (user.otp !== otp || new Date() > user.otpExpiry) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid or expired reset code" 
        });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear OTP fields
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    return res.status(200).json({ 
        success: true, 
        message: "Password has been reset successfully" 
    });
});
export const deleteUser = catchError(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return next(new AppError("User Not Found", 404));
    }
    res.status(201).json({
        Message: "Deleted"
    })
})