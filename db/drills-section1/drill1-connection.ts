import dotenv from "dotenv";
import { Pool } from "./node_modules/@types/pg/index.js";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log("Connecting to Postgres...");
  console.log(`Database URL: ${process.env.DATABASE_URL}`);

  const result = await pool.query("SELECT NOW()");
  console.log("Connection successful!");
  console.log("Server time:", result.rows[0].now);

  await pool.end();
  console.log("Pool closed.");
}

main().catch((err) => {
  console.error("Connection failed:", err.message);
  process.exit(1);
});
