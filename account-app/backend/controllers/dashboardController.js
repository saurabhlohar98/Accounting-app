/** @format */

// backend/routes/dashboardRoutes.js

import Ledger from "../models/ledgerModel.js";
import TransactionMaster from "../models/transactionMasterModel.js";
import sequelize from "../db/index.js";

// We'll store manual closing balance in-memory (for now) or DB
let manualClosingBalance = 0;

export const getDashboardStats = async (req, res) => {
  try {
    const totalLedgers = await Ledger.count();
    const totalEntries = await TransactionMaster.count();

    // Reports count — can later come from a reports table, for now just random placeholder
    const totalReports = 8;

    res.json({
      totalLedgers,
      totalEntries,
      totalReports,
      closingBalance: manualClosingBalance,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Closing Balance manually
export const updateClosingBalance = (req, res) => {
  const { closingBalance } = req.body;
  if (closingBalance === undefined || isNaN(closingBalance)) {
    return res.status(400).json({ message: "Invalid closing balance" });
  }
  manualClosingBalance = parseFloat(closingBalance);
  res.json({ success: true, closingBalance: manualClosingBalance });
};
