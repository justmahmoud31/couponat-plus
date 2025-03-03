/**
 * Generates a 6-digit OTP and sets an expiry time of 15 minutes
 * @returns {Object} Object containing OTP and expiry date
 */
export const generateOTP = () => {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP expiry (15 minutes from now)
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);
    
    return { otp, otpExpiry };
};

/**
 * Creates HTML email template for initial account verification
 * @param {string} username Username to address in the email
 * @param {string} otp One-time password to include in the email
 * @returns {string} HTML email content
 */
export const createVerificationEmail = (username, otp) => {
    return `
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
};

/**
 * Creates HTML email template for new verification code
 * @param {string} username Username to address in the email
 * @param {string} otp One-time password to include in the email
 * @returns {string} HTML email content
 */
export const createNewVerificationEmail = (username, otp) => {
    return `
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
                <h2>مرحباً ${username}،</h2>
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
};

/**
 * Creates HTML email template for password reset
 * @param {string} username Username to address in the email
 * @param {string} otp One-time password to include in the email
 * @returns {string} HTML email content
 */
export const createPasswordResetEmail = (username, otp) => {
    return `
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
                <h2>مرحباً ${username}،</h2>
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
};