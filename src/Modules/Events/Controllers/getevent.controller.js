import { Event } from "../../../../database/Models/Events.js";
import { catchError } from "../../../Middlewares/catchError.js";
import mongoose from "mongoose";

export const getAllEvents = catchError(async (req, res, next) => {
  let {
    isActive,
    category,
    categoryId,
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
  } = req.query;

  let filter = {};

  // Handle active/inactive filter
  if (isActive === "true") {
    filter.isActive = true;
  } else if (isActive === "false") {
    filter.isActive = false;
  }

  // Filter by category if provided
  const categoryParameter = categoryId || category;
  if (categoryParameter) {
    if (mongoose.Types.ObjectId.isValid(categoryParameter)) {
      filter.category_id = new mongoose.Types.ObjectId(categoryParameter);
    } else {
      return res.status(400).json({ message: "Invalid category ID" });
    }
  }

  if (sort === "asc") {
    sort = { createdAt: 1 };
  } else if (sort === "desc") {
    sort = { createdAt: -1 };
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get paginated and sorted events with populated category data
  const allEvents = await Event.find(filter)
    .populate("category_id", "name image")
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const eventsCount = await Event.countDocuments(filter);

  res.status(200).json({
    message: "success",
    eventsCount,
    totalPages: Math.ceil(eventsCount / limit),
    currentPage: parseInt(page),
    allEvents,
  });
});

export const getAllActiveEvents = catchError(async (req, res, next) => {
  const filter = { isActive: true };
  const allEvents = await Event.find(filter)
    .populate("category_id", "name image")
    .sort({ eventDate: 1, createdAt: -1 });

  const eventsCount = allEvents.length;

  res.status(200).json({
    message: "success",
    eventsCount,
    allEvents,
  });
});

export const getEventById = catchError(async (req, res, next) => {
  const { id } = req.params;
  const event = await Event.findById(id).populate("category_id", "name image");

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  if (!event.isActive) {
    return res.status(403).json({
      message: "Event not available",
    });
  }

  event.viewCount += 1;
  await event.save();

  let relatedEvents = [];
  if (event.category_id) {
    relatedEvents = await Event.find({
      category_id: event.category_id,
      _id: { $ne: event._id },
      isActive: true,
    })
      .limit(3)
      .populate("category_id", "name image");
  }

  res.status(200).json({
    message: "success",
    event,
    relatedEvents,
  });
});

export const getUpcomingEvents = catchError(async (req, res) => {
  const today = new Date();
  const events = await Event.find({
    isActive: true,
    eventDate: { $gte: today },
  })
    .populate("category_id", "name image")
    .sort({ eventDate: 1 })
    .limit(10);

  res.status(200).json({
    message: "success",
    count: events.length,
    events,
  });
});

export const getEventsByCategory = catchError(async (req, res) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  const events = await Event.find({
    isActive: true,
    category_id: categoryId,
  })
    .populate("category_id", "name image")
    .sort({ eventDate: 1, createdAt: -1 });

  res.status(200).json({
    message: "success",
    count: events.length,
    events,
  });
});
