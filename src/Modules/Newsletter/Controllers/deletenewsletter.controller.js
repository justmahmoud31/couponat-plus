import { Newsletter } from "../../../../database/Models/Newsletter.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const unsubscribeNewsletter = catchError(async (req, res, next) => {
  const { email } = req.params;

  const subscription = await Newsletter.findOne({ email });
  if (!subscription) {
    return res
      .status(404)
      .json({ message: "هذا البريد غير مشترك في النشرة البريدية" });
  }

  subscription.isActive = false;
  await subscription.save();

  res.status(200).json({ message: "تم إلغاء الاشتراك بنجاح" });
});

export const deleteSubscriber = catchError(async (req, res, next) => {
  const { id } = req.params;

  const result = await Newsletter.findByIdAndDelete(id);
  if (!result) {
    return res.status(404).json({ message: "المشترك غير موجود" });
  }

  res.status(200).json({ message: "تم حذف المشترك بنجاح" });
});
