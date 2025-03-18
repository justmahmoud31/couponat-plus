import express from "express";
import { getMarketingSection } from "./Controllers/getmarketing.controller.js";
import { updateMarketingSection } from "./Controllers/editmarketing.controller.js";
import { isAuthenticated, authorizeRoles } from '../../Middlewares/auth.middleware.js'
import { deleteMarketingSection } from "./Controllers/deletemarketing.controller.js";

const router = express.Router();

router.get("/", getMarketingSection);
router.put("/", isAuthenticated, authorizeRoles("admin"), updateMarketingSection);
router.delete("/", isAuthenticated, authorizeRoles("admin"), deleteMarketingSection);

export default router;
