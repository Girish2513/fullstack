import dotenv from "dotenv";
dotenv.config();

import { resetDatabase, runMigrations } from "../src/db/migrator.js";
import { closePool } from "../src/db/database.js";

async function main() {
  console.log("resetting database...");
  await resetDatabase();
  console.log("tables dropped");

  console.log("\nrunning migrations...");
  const count = await runMigrations();
  console.log(`applied ${count} migrations`);

  console.log("reset complete");
  await closePool();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
