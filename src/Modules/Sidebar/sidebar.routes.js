import express from "express";
import { authorizeRoles, isAuthenticated } from "../../Middlewares/auth.middleware.js";
import { getSidebar } from "./Controllers/getSidebar.controller.js";
import { addSidebarItem } from "./Controllers/addSidebar.controller.js";
import { updateSidebarItem } from "./Controllers/updateSidebar.controller.js";
import { deleteSidebarItem } from "./Controllers/deleteSidebar.controller.js";

const router = express.Router();

router.get("/", getSidebar);

router.post("/", isAuthenticated, authorizeRoles("admin"), addSidebarItem);
router.patch(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateSidebarItem
);
router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteSidebarItem
);

export default router;
