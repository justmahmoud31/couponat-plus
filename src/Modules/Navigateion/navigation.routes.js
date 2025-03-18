import express from "express";
import { getAllNavigations, getNavigationById } from "./Controllers/getnavigation.controller.js";
import { createNavigation } from "./Controllers/addnavigation.controller.js";


const router = express.Router();

router.post("/", createNavigation);
router.get("/", getAllNavigations);
router.get("/:id", getNavigationById);
// router.put("/:id", updateNavigation);
// router.delete("/:id", deleteNavigation);

export default router;
