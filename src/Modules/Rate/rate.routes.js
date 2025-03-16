import express from 'express';
import { createRate } from './Controllers/addrate.controller.js';
import { getAllRates, getRateById, getStoreRates } from './Controllers/getrates.controller.js';
import { deleteRate } from './Controllers/delete.controller.js';
import { authorizeRoles, isAuthenticated } from '../../Middlewares/auth.middleware.js';
const router = express.Router();

router.post("/", isAuthenticated, createRate);
router.get("/", isAuthenticated, authorizeRoles("admin"), getAllRates);
router.get("/:id", isAuthenticated, authorizeRoles("admin"), getRateById);
router.delete("/:id", isAuthenticated, deleteRate);
router.get('/storerate/:id', getStoreRates);
export default router;