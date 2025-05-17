import express from "express";
import { getSidebarAds } from "./Controllers/getSidebarAds.controller.js";
import {
  addSidebarAd,
  updateSidebarAd,
} from "./Controllers/addSidebarAd.controller.js";
import { deleteSidebarAd } from "./Controllers/deleteSidebarAd.controller.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../../Middlewares/auth.middleware.js";
import { singleFile } from "../../Config/multerConfig.js";

const router = express.Router();

router.get("/", getSidebarAds);

router.post(
  "/",
  isAuthenticated,
  authorizeRoles("admin"),
  singleFile("image", "sidebar-ads"),
  addSidebarAd
);

router.patch(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  singleFile("image", "sidebar-ads"),
  updateSidebarAd
);

router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteSidebarAd
);

export default router;
