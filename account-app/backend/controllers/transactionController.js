/** @format */

import {
  TransactionMaster,
  TransactionDetail,
  Ledger,
} from "../models/index.js";
import { Op } from "sequelize";

export const createTransaction = async (req, res) => {
  const t = await TransactionMaster.sequelize.transaction();
  try {
    const { transaction_date, remarks, details } = req.body;
    if (!transaction_date || !details || details.length !== 1)
      return res.status(400).json({ message: "Single detail required" });

    const detail = details[0];
    const debit = parseFloat(detail.debit) || 0;
    const credit = parseFloat(detail.credit) || 0;
    if ((debit > 0 && credit > 0) || (debit <= 0 && credit <= 0))
      return res.status(400).json({ message: "Invalid debit/credit" });

    // Generate FY ref no
    const date = new Date(transaction_date);
    const fy =
      date.getMonth() + 1 >= 4 ? date.getFullYear() + 1 : date.getFullYear();
    const fyCode = `FY${fy.toString().slice(-2)}`;
    const monthCode = date.toLocaleString("en-US", { month: "short" });
    const count = await TransactionMaster.count();
    const refNo = `${fyCode}${monthCode}${(count + 1)
      .toString()
      .padStart(5, "0")}`;

    const master = await TransactionMaster.create(
      { transaction_date, reference_no: refNo, remarks },
      { transaction: t }
    );

    await TransactionDetail.create(
      {
        transaction_master_id: master.id,
        ledger_id: detail.ledger_id,
        debit,
        credit,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ message: "Transaction saved", reference_no: refNo });
  } catch (err) {
    await t.rollback();
    res
      .status(500)
      .json({ message: "Failed to create transaction", error: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await TransactionMaster.findAll({
      include: [
        {
          model: TransactionDetail,
          as: "details",
          include: [
            { model: Ledger, as: "ledger", attributes: ["id", "ledger_name"] },
          ],
        },
      ],
      order: [["transaction_date", "DESC"]],
    });
    res.json(transactions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch transactions", error: err.message });
  }
};
