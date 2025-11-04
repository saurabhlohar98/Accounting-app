/** @format */

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

try {
  await sequelize.authenticate();
  console.log("✅ MySQL Connected Successfully!");
} catch (error) {
  console.error("❌ DB Connection Failed:", error);
}

export default sequelize;
