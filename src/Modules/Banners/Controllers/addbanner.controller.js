import { Banner } from "../../../../database/Models/Banner.js";
import { catchError } from "../../../Middlewares/catchError.js";

const addBanner = catchError(async (req, res, next) => {
  const { title, type, description, link } = req.body;

  if (!title || !type) {
    return res.status(400).json({ message: "Title and type are required." });
  }

  const validTypes = ["slider", "static", "TwoBanner", "bannerText"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid banner type." });
  }

  const imagePaths =
    req.files && req.files.images
      ? req.files.images.map((file) => file.path)
      : [];

  const newBanner = new Banner({
    title,
    images: imagePaths,
    type,
    description,
    link,
    isActive: "true",
  });

  await newBanner.save();

  res
    .status(201)
    .json({ message: "Banner added successfully.", banner: newBanner });
});

export { addBanner };
