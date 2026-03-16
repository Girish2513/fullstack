import dotenv from "dotenv";
dotenv.config();

import { runMigrations } from "../src/db/migrator.js";
import { closePool } from "../src/db/database.js";

async function main() {
  console.log("running migrations...");
  const count = await runMigrations();
  console.log(`done. applied ${count} migrations`);
  await closePool();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
