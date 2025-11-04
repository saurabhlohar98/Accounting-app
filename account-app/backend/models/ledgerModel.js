/** @format */

import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Ledger = sequelize.define("ledger", {
  ledger_name: { type: DataTypes.STRING, allowNull: false },
  ledger_type: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
});

export default Ledger;
