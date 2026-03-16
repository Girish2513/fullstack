import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected:", result.rows);
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

testDB();
process.on("SIGINT", async () => {
  console.log("Shutting down...");

  await pool.end();

  process.exit(0);
});
