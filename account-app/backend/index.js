/** @format */

import express from "express";
import cors from "cors";
import sequelize from "./db/index.js";
import ledgerRoutes from "./routes/ledgerRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/ledgers", ledgerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("💼 Accounting API Running (Clean Version)");
});

// ✅ DB + Server
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));
