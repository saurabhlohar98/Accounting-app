/** @format */

import sequelize from "../db/index.js";
import Ledger from "./ledgerModel.js";
import TransactionMaster from "./transactionMasterModel.js";
import TransactionDetail from "./transactionDetailModel.js";

// 🔗 Relations
TransactionMaster.hasMany(TransactionDetail, {
  foreignKey: "transaction_master_id",
  as: "details",
});
TransactionDetail.belongsTo(TransactionMaster, {
  foreignKey: "transaction_master_id",
  as: "transaction_master",
});

Ledger.hasMany(TransactionDetail, {
  foreignKey: "ledger_id",
  as: "ledger_details",
});
TransactionDetail.belongsTo(Ledger, {
  foreignKey: "ledger_id",
  as: "ledger",
});

// 🔄 Sync
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully");
  } catch (err) {
    console.error("❌ Error syncing database:", err);
  }
};

syncDatabase();

export { sequelize, Ledger, TransactionMaster, TransactionDetail };
