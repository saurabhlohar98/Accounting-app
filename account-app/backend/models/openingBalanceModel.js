/** @format */

//backend/models/openingBalanceModel.js

import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const OpeningBalance = sequelize.define("opening_balance", {
  ledger_id: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, defaultValue: 0 },
  balance_type: { type: DataTypes.STRING }, // e.g. Debit or Credit
});

export default OpeningBalance;
