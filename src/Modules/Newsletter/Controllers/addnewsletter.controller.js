import { Newsletter } from "../../../../database/Models/Newsletter.js";
import { catchError } from "../../../Middlewares/catchError.js";
import  sendEmail  from "../../../Utils/SendEmail.js";

export const subscribeNewsletter = catchError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "البريد الإلكتروني مطلوب" });
  }

  const existingSubscription = await Newsletter.findOne({ email });
  if (existingSubscription) {
    if (existingSubscription.isActive) {
      return res
        .status(400)
        .json({ message: "هذا البريد الإلكتروني مشترك بالفعل" });
    } else {
      // If inactive, reactivate subscription
      existingSubscription.isActive = true;
      await existingSubscription.save();
      return res.status(200).json({ message: "تم إعادة تفعيل اشتراكك بنجاح" });
    }
  }

  const newSubscription = new Newsletter({ email });
  await newSubscription.save();

  try {
    await sendEmail(
      email,
      "مرحبًا بك في النشرة البريدية",
      `شكرًا لاشتراكك في النشرة البريدية الخاصة بنا. ستصلك أحدث العروض والخصومات المتاحة.`
    );
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }

  res.status(201).json({ message: "تم الاشتراك بنجاح" });
});
