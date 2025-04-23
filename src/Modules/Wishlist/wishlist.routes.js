import express from "express";
import { isAuthenticated } from "../../Middlewares/auth.middleware.js";
import { addToWishlist } from "./Controllers/addtiwishlist.controller.js";
import { removeFromWishlist } from "./Controllers/removefromwishlist.controller.js";
import { getMyWishlist } from "./Controllers/getWishlist.controller.js";
import { checkWishlistItem } from "./Controllers/checkWishlist.controller.js";

const router = express.Router();

router.post("/", isAuthenticated, addToWishlist);
router.delete("/", isAuthenticated, removeFromWishlist);
router.get("/", isAuthenticated, getMyWishlist);
router.get("/check", isAuthenticated, checkWishlistItem);

export default router;
