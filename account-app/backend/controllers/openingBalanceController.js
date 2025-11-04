/** @format */

// backend/controllers/openingBalanceController.js

import OpeningBalance from "../models/openingBalanceModel.js";
import Ledger from "../models/ledgerModel.js";
import TransactionMaster from "../models/transactionMasterModel.js";
import TransactionDetail from "../models/transactionDetailModel.js";
import { Op } from "sequelize";

export const getOpeningBalanceReport = async (req, res) => {
  try {
    const { fromDate, toDate, ledgerId } = req.query;

    // 🔹 Validate date inputs
    if (!fromDate || !toDate) {
      return res
        .status(400)
        .json({ message: "Please provide valid date range" });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    // 🔹 Ledger filter
    const ledgerFilter = ledgerId && ledgerId !== "all" ? { id: ledgerId } : {};

    // 🔹 Get all ledgers (plain objects)
    const ledgers = await Ledger.findAll({
      where: ledgerFilter,
      raw: true,
    });

    const reportData = [];

    for (const ledger of ledgers) {
      // 🔹 Opening balance check
      const opening = await OpeningBalance.findOne({
        where: { ledger_id: ledger.id },
      });

      let openingAmount = opening ? opening.amount : 0;
      if (opening?.balance_type === "Credit") openingAmount = -openingAmount;

      // 🔹 Transaction details (within date range)
      const txDetails = await TransactionDetail.findAll({
        include: [
          {
            model: TransactionMaster,
            as: "transaction_master",
            where: {
              transaction_date: { [Op.between]: [from, to] },
            },
          },
        ],
        where: { ledger_id: ledger.id },
      });

      let totalDebit = 0;
      let totalCredit = 0;

      txDetails.forEach((tx) => {
        totalDebit += tx.debit || 0;
        totalCredit += tx.credit || 0;
      });

      const closing = openingAmount + totalDebit - totalCredit;

      // 🔹 Final record push
      reportData.push({
        ledger: ledger.ledger_name || `Ledger #${ledger.id}`,
        ledger_type: ledger.ledger_type || "—",
        opening: openingAmount,
        totalDebit,
        totalCredit,
        closing,
      });
    }

    // ✅ Send clean response
    return res.status(200).json(reportData);
  } catch (error) {
    console.error("Error generating opening balance report:", error);
    res
      .status(500)
      .json({ message: "Error generating report", error: error.message });
  }
};
