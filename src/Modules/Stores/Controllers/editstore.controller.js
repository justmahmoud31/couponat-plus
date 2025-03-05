
import { catchError } from "../../../Middlewares/catchError.js";
import fs from "fs";
import path from "path";
import { Store } from "../../../../database/Models/Store.js";

export const editstore = catchError(async (req, res) => {
  const { id } = req.params;
  const { name, description, link, categories } = req.body;
  const logo = req.file ? req.file.path : null;
  // Find the store
  const store = await Store.findById(id);
  if (!store) {
    return res.status(404).json({ message: "Store not found" });
  }
  // Delete old logo if new one uploaded
  if (logo) {
    if (store.logo) {
      const oldLogoPath = path.resolve(store.logo);
      fs.unlink(oldLogoPath, (err) => {
        if (err) {
          console.error("Error deleting old logo:", err.message);
        } else {
          console.log("Old logo deleted successfully.");
        }
      });
    }
    store.logo = logo; // Set the new logo
  }

  // Update only if values exist
  if (name) store.name = name;
  if (description) store.description = description;
  if (link) store.link = link;
  if (categories) store.categories = JSON.parse(categories);

  const updatedStore = await store.save();

  res.status(200).json({
    message: "Store updated successfully",
    store: updatedStore,
  });
});
