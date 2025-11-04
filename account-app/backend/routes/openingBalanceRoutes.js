/** @format */

// backend/routes/openingBalanceRoutes.js

import express from "express";
import { getOpeningBalanceReport } from "../controllers/openingBalanceController.js";

const router = express.Router();

// 📊 Route to get report
router.get("/report", getOpeningBalanceReport);

export default router;
