import { Newsletter } from "../../../../database/Models/Newsletter.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getAllSubscribers = catchError(async (req, res, next) => {
  const { page = 1, limit = 10, isActive } = req.query;

  // Build filter
  let filter = {};
  if (isActive === "true") {
    filter.isActive = true;
  } else if (isActive === "false") {
    filter.isActive = false;
  }

  const subscribers = await Newsletter.find(filter)
    .sort({ createdAt: -1 })
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));

  const subscribersCount = await Newsletter.countDocuments(filter);

  res.status(200).json({
    message: "success",
    subscribersCount,
    totalPages: Math.ceil(subscribersCount / limit),
    currentPage: parseInt(page),
    subscribers,
  });
});
