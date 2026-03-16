import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { testConnection, closePool } from "./db/database.js";

const PORT = process.env.PORT || 3001;

async function start() {
  const ok = await testConnection();
  if (!ok) {
    console.error("failed to connect to database");
    process.exit(1);
  }
  console.log("database connected");

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
}

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received, shutting down...`);
  await closePool();
  process.exit(0);
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start();
