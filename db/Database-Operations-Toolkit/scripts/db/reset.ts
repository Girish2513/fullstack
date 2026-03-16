import dotenv from "dotenv";
dotenv.config();

import * as fs from "fs";
import * as path from "path";
import { resetDatabase, runMigrations } from "../../src/db/migrator.js";
import { getPool, closePool } from "../../src/db/database.js";

async function main() {
  console.log("resetting database...");
  await resetDatabase();
  console.log("tables dropped");

  console.log("\nrunning migrations...");
  const count = await runMigrations();
  console.log(`applied ${count} migrations`);

  const seedPath = path.join(process.cwd(), "seeds", "development.sql");
  if (fs.existsSync(seedPath)) {
    console.log("\nseeding...");
    const sql = fs.readFileSync(seedPath, "utf-8");
    await getPool().query(sql);
    console.log("seed complete");
  }

  console.log("\nreset complete");
  await closePool();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
