import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected pool error:", err.message);
});

export async function testConnection() {
  const result = await pool.query("SELECT NOW()");
  console.log("Database connected:", result.rows[0].now);
}

export async function closePool() {
  await pool.end();
  console.log("Database pool closed.");
}
