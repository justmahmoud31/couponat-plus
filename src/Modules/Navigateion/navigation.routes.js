import express from "express";
import {
  getAllNavigations,
  getNavigationById,
  getNavigationTree,
} from "./Controllers/getnavigation.controller.js";
import { createNavigation } from "./Controllers/addnavigation.controller.js";
import { editNavigation } from "./Controllers/editnavigation.controller.js";
import { deleteNavigation } from "./Controllers/deletenavigation.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../../Middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllNavigations);
router.get("/tree", getNavigationTree);
router.get("/:id", getNavigationById);

// Protected routes - admin only
router.post("/", isAuthenticated, authorizeRoles("admin"), createNavigation);
router.patch("/:id", isAuthenticated, authorizeRoles("admin"), editNavigation);
router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteNavigation
);

export default router;
