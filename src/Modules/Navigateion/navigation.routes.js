import express from "express";
import { getAllNavigations, getNavigationById } from "./Controllers/getnavigation.controller.js";
import { createNavigation } from "./Controllers/addnavigation.controller.js";
import { editNavigation } from "./Controllers/editnavigation.controller.js";
import { deleteNavigation } from "./Controllers/deletenavigation.controller.js";


const router = express.Router();

router.post("/", createNavigation);
router.get("/", getAllNavigations);
router.get("/:id", getNavigationById);
router.patch("/:id", editNavigation);
router.delete("/:id", deleteNavigation);

export default router;
