import express from "express";
import { subscribeNewsletter } from "./Controllers/addnewsletter.controller.js";
import { getAllSubscribers } from "./Controllers/getnewsletter.controller.js";
import {
  unsubscribeNewsletter,
  deleteSubscriber,
} from "./Controllers/deletenewsletter.controller.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", subscribeNewsletter);
router.get("/unsubscribe/:email", unsubscribeNewsletter);

// Admin routes
router.get("/", isAuthenticated, authorizeRoles("admin"), getAllSubscribers);
router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteSubscriber
);

export default router;
