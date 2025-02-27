import fs from "fs-extra";
import path from "path";
import mongoose from "mongoose";
import { catchError } from "./catchError.js";


/**
 * Middleware to delete old files before updating a document.
 * @param {Model} Model - Mongoose model (e.g., Product, User).
 * @param {Object} fileFields - Object defining which fields hold files.
 */
export const deleteOldFiles = (Model, fileFields) => catchError(async (req, res, next) => {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    const document = await Model.findById(id);
    if (!document) {
        return res.status(404).json({ message: "Resource not found" });
    }

    // Helper function to delete a file
    const deleteFile = (filePath) => {
        if (filePath) {
            const absolutePath = path.join("uploads", filePath.replace("/uploads/", ""));
            if (fs.existsSync(absolutePath)) {
                fs.removeSync(absolutePath);
            }
        }
    };

    // Loop through file fields and delete old files if new ones are uploaded
    for (const field in fileFields) {
        if (req.files?.[field]) {
            const oldValue = document[field];
            if (Array.isArray(oldValue)) {
                oldValue.forEach(deleteFile); // Delete each file in the array
            } else {
                deleteFile(oldValue); // Delete single file
            }
        }
    }

    next(); // Proceed to update controller
});
