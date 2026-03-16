import dotenv from "dotenv";
dotenv.config();

import { rollbackLast } from "../src/db/migrator.js";
import { closePool } from "../src/db/database.js";

async function main() {
  const env = process.env.NODE_ENV || "development";
  if (env === "production") {
    console.error("rollback not allowed in production");
    process.exit(1);
  }

  console.log("rolling back last migration...");
  const rolled = await rollbackLast();
  if (rolled) {
    console.log(`rolled back: ${rolled}`);
  } else {
    console.log("nothing to rollback");
  }
  await closePool();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
