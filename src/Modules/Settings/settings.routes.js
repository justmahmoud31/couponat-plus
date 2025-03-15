import express from "express";
import { mixedFiles } from "../../Config/multerConfig.js";
import { createSettings } from "./Controllers/addsettings.controller.js";
import { updateSettings } from "./Controllers/editsettings.controller.js";


const router = express.Router();

// Upload fields configuration for settings
const uploadFields = mixedFiles([
    { name: "logo", maxCount: 1 },
    { name: "icon", maxCount: 1 },
    { name: "marketingBanners", maxCount: 10 },
], "settings");

// POST - Create Settings
router.post("/", uploadFields, createSettings);

// PATCH - Update Settings
router.patch("/:id", uploadFields, updateSettings);

export default router;
