import express from "express";
import getsectionController from "./Controllers/getsection.controller.js";
import { addSection } from "./Controllers/addsection.controller.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../../Middlewares/auth.middleware.js";
import {
  editSection,
  normalizeOrders,
  shiftSection,
  switchOrder,
} from "./Controllers/editsection.controller.js";
import { deleteSection } from "./Controllers/deletesection.controller.js";
const router = express.Router();
router.get("/", isAuthenticated, authorizeRoles("admin"), getsectionController.getSection);
router.get('/all', getsectionController.getActiveSections);
router.post("/", isAuthenticated, authorizeRoles("admin"), addSection);
router.patch(
  "/switch-order",
  isAuthenticated,
  authorizeRoles("admin"),
  switchOrder
);
router.patch(
  "/shift-section",
  isAuthenticated,
  authorizeRoles("admin"),
  shiftSection
);
router.patch(
  "/normalize-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  normalizeOrders
);
router.patch("/:id", isAuthenticated, authorizeRoles("admin"), editSection);
router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteSection);
export default router;
