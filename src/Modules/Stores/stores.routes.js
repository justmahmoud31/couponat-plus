import express from "express";
import { singleFile } from "../../Config/multerConfig.js";
import { addStore } from "./Controllers/addstore.controller.js";
import {
  getAllActiveStores,
  getAllStores,
  getOneStore,
  getStoresByCategory,
  getStoreBySlug,
} from "./Controllers/getstore.controller.js";
import { editstore } from "./Controllers/editstore.controller.js";
import {
  deleteStore,
  revertStore,
  permanentDeleteStore,
} from "./Controllers/deletestore.controller.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../../Middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  authorizeRoles("admin"),
  singleFile("logo", "store"),
  addStore
);

router.get("/", isAuthenticated, authorizeRoles("admin"), getAllStores);
router.get("/all", getAllActiveStores);
router.get("/byslug/:slug", getStoreBySlug);
router.get("/storebyslug/:slug", getStoresByCategory);
router.get("/:id", getOneStore);

router.patch(
  "/delete/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteStore
);

router.patch(
  "/restore/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  revertStore
);

router.delete(
  "/permanent/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  permanentDeleteStore
);

router.patch(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  singleFile("logo", "store"),
  editstore
);

export default router;
