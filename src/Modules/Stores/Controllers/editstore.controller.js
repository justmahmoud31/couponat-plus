import { catchError } from "../../../Middlewares/catchError.js";
import fs from "fs";
import path from "path";
import { Store } from "../../../../database/Models/Store.js";

export const editstore = catchError(async (req, res) => {
  const { id } = req.params;
  const { name, description, link, categories, coupons, products } = req.body;
  const logo = req.file
    ? req.file.path
    : req.body.logo === "null"
    ? null
    : undefined;

  // Find the store
  const store = await Store.findById(id);
  if (!store) {
    return res.status(404).json({ message: "Store not found" });
  }

  // Handle logo
  if (logo !== undefined) {
    // Only process if logo was included in the request
    // If there's an existing logo and we're changing it (either to a new one or removing it)
    if (store.logo && (req.file || logo === null)) {
      try {
        const oldLogoPath = path.resolve(store.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
          console.log("Old logo deleted successfully.");
        }
      } catch (err) {
        console.error("Error deleting old logo:", err.message);
      }
    }
    // Set the new logo value (can be a new path or null)
    store.logo = logo;
  }

  // Update only if values exist
  if (name) store.name = name;
  if (description) store.description = description;
  if (link) store.link = link;
  if (categories) store.categories = JSON.parse(categories);
  if (coupons) store.coupons = JSON.parse(coupons);
  if (products) store.products = JSON.parse(products);

  const updatedStore = await store.save();

  res.status(200).json({
    message: "Store updated successfully",
    store: updatedStore,
  });
});
