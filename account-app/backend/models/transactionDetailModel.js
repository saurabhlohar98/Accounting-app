/** @format */

import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const TransactionDetail = sequelize.define("transaction_detail", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  transaction_master_id: { type: DataTypes.INTEGER, allowNull: false },
  ledger_id: { type: DataTypes.INTEGER, allowNull: false },
  debit: { type: DataTypes.FLOAT, defaultValue: 0 },
  credit: { type: DataTypes.FLOAT, defaultValue: 0 },
});

export default TransactionDetail;
