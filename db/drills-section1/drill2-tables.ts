import dotenv from "dotenv";
import { Pool } from "./node_modules/@types/pg/index.js";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await pool.query("DROP TABLE IF EXISTS tasks");
  await pool.query("DROP TABLE IF EXISTS users");
  console.log("Dropped existing tables (if any).");

  await pool.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log("Created users table.");

  await pool.query(`
    CREATE TABLE tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log("Created tasks table.");

  await pool.query(`INSERT INTO users (email) VALUES ('girish@example.com')`);
  await pool.query(`INSERT INTO users (email) VALUES ('revanth@example.com')`);
  console.log("Inserted 2 users.");

  await pool.query(`INSERT INTO tasks (title) VALUES ('Learn SQL basics')`);
  await pool.query(
    `INSERT INTO tasks (title, completed) VALUES ('Set up Postgres', true)`,
  );
  await pool.query(`INSERT INTO tasks (title) VALUES ('Build an API')`);
  console.log("Inserted 3 tasks.");

  const usersResult = await pool.query("SELECT * FROM users");
  console.log("\n--- Users ---");
  console.table(usersResult.rows);

  const tasksResult = await pool.query("SELECT * FROM tasks");
  console.log("--- Tasks ---");
  console.table(tasksResult.rows);

  await pool.end();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
