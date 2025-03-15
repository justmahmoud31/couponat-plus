import express from "express";
import { mixedFiles } from "../../Config/multerConfig.js";
import { updateSettings } from "./Controllers/editsettings.controller.js";
import { getSettings } from "./Controllers/getsettings.controller.js";
import { authorizeRoles, isAuthenticated } from "../../Middlewares/auth.middleware.js";


const router = express.Router();

// Upload fields configuration for settings
const uploadFields = mixedFiles([
    { name: "logo", maxCount: 1 },
    { name: "icon", maxCount: 1 },
    { name: "marketingBanners", maxCount: 10 },
], "settings");


router.get('/', getSettings);
// PATCH - Update Settings
router.patch("/", isAuthenticated, authorizeRoles("admin"), uploadFields, updateSettings);

export default router;
