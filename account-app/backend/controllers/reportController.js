/** @format */

import { Op } from "sequelize";
import TransactionDetail from "../models/transactionDetailModel.js";
import TransactionMaster from "../models/transactionMasterModel.js";
import Ledger from "../models/ledgerModel.js";

export const getReport = async (req, res) => {
  try {
    const { fromDate, toDate, ledgerId } = req.query;
    if (!fromDate || !toDate)
      return res.status(400).json({ message: "Date range required" });

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const filter = ledgerId && ledgerId !== "all" ? { id: ledgerId } : {};
    const ledgers = await Ledger.findAll({ where: filter, raw: true });

    const data = [];
    for (const ledger of ledgers) {
      const tx = await TransactionDetail.findAll({
        include: [
          {
            model: TransactionMaster,
            as: "transaction_master",
            where: { transaction_date: { [Op.between]: [from, to] } },
          },
        ],
        where: { ledger_id: ledger.id },
      });

      let debit = 0,
        credit = 0;
      tx.forEach((t) => {
        debit += t.debit || 0;
        credit += t.credit || 0;
      });

      data.push({
        ledger: ledger.ledger_name,
        ledger_type: ledger.ledger_type,
        totalDebit: debit,
        totalCredit: credit,
        closing: debit - credit,
      });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Report error", error: err.message });
  }
};
