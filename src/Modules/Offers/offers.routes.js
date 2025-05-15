import express from "express";
import * as offerController from "./offers.controller.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../../Middlewares/auth.middleware.js";
import { singleFile } from "../../Config/multerConfig.js";

const router = express.Router();

// Public routes
router.get("/", offerController.getAllOffers);
router.get("/id/:id", offerController.getOfferById);
router.get("/slug/:slug", offerController.getOfferBySlug);
router.get("/:slug", offerController.getOfferBySlug);
router.post("/track-view/:id", offerController.trackViewOffer);

// Protected routes (admin only)
router.post(
  "/",
  isAuthenticated,
  authorizeRoles("admin"),
  singleFile("image", "offers"),
  offerController.createOffer
);
router.put(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  singleFile("image", "offers"),
  offerController.updateOffer
);
router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  offerController.deleteOffer
);
router.put(
  "/:id/restore",
  isAuthenticated,
  authorizeRoles("admin"),
  offerController.restoreOffer
);
router.delete(
  "/:id/permanent",
  isAuthenticated,
  authorizeRoles("admin"),
  offerController.permanentlyDeleteOffer
);

// Activation routes
router.put(
  "/:id/activate",
  isAuthenticated,
  authorizeRoles("admin"),
  offerController.activateOffer
);
router.put(
  "/:id/deactivate",
  isAuthenticated,
  authorizeRoles("admin"),
  offerController.deactivateOffer
);

export default router;
