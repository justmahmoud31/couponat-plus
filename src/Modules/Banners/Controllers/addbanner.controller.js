import { Banner } from "../../../../database/Models/Banner.js";
import { catchError } from "../../../Middlewares/catchError.js";

const addBanner = catchError(async (req, res, next) => {
  const { title, type, description, link } = req.body;
  let imageLinks = [];

  if (req.body.imageLinks) {
    try {
      imageLinks = JSON.parse(req.body.imageLinks);
    } catch (err) {
      console.error("Error parsing imageLinks:", err);
    }
  }

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

  // Create images with links if available
  const images = imagePaths.map((path, index) => {
    if (imageLinks && imageLinks[index]) {
      return {
        path,
        link: imageLinks[index],
      };
    }
    return path;
  });

  const newBanner = new Banner({
    title,
    images,
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
