/** @format */

import express from "express";
import {
  createLedger,
  getLedgers,
  getLedgerById,
  updateLedger,
  deleteLedger,
} from "../controllers/ledgerController.js";

const router = express.Router();
router.post("/", createLedger);
router.get("/", getLedgers);
router.get("/:id", getLedgerById);
router.put("/:id", updateLedger);
router.delete("/:id", deleteLedger);
export default router;
