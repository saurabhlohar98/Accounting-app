/** @format */

// backend/routes/dashboardRoutes.js

import express from "express";
import {
  getDashboardStats,
  updateClosingBalance,
} from "../controllers/dashboardController.js";

const router = express.Router();

// GET dashboard stats
router.get("/", getDashboardStats);

// PUT to update closing balance manually
router.put("/closing-balance", updateClosingBalance);

export default router;
