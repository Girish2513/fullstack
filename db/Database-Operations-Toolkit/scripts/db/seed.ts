import dotenv from "dotenv";
dotenv.config();

import * as fs from "fs";
import * as path from "path";
import { getPool, closePool } from "../../src/db/database.js";

async function main() {
  const seedFile = process.argv[2] || "development";
  const seedPath = path.join(process.cwd(), "seeds", `${seedFile}.sql`);

  if (!fs.existsSync(seedPath)) {
    console.error(`seed file not found: ${seedPath}`);
    process.exit(1);
  }

  console.log(`seeding with: ${seedFile}`);
  const sql = fs.readFileSync(seedPath, "utf-8");
  await getPool().query(sql);
  console.log("seed complete");
  await closePool();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
