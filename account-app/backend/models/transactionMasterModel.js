/** @format */

import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const TransactionMaster = sequelize.define("transaction_master", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  transaction_date: { type: DataTypes.DATEONLY, allowNull: false },
  reference_no: { type: DataTypes.STRING, allowNull: false, unique: true },
  remarks: { type: DataTypes.STRING },
});

export default TransactionMaster;
