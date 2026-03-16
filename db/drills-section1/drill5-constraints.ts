import dotenv from "dotenv";
import { Pool, DatabaseError } from "./node_modules/@types/pg/index.js";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await pool.query("DROP TABLE IF EXISTS tasks");
  await pool.query("DROP TABLE IF EXISTS users");

  await pool.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL CHECK (LENGTH(title) > 0),
      completed BOOLEAN DEFAULT FALSE,
      user_id INTEGER REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log("Created tables with constraints.\n");

  console.log("Test 1: Insert task with empty title...");
  try {
    await pool.query("INSERT INTO tasks (title) VALUES ($1)", [""]);
  } catch (err) {
    const dbErr = err as DatabaseError;
    console.log(
      `  REJECTED! Code: ${dbErr.code}, Constraint: ${dbErr.constraint}`,
    );
    console.log(`  Message: ${dbErr.message}\n`);
  }

  console.log("Test 2: Insert duplicate email...");
  await pool.query("INSERT INTO users (email) VALUES ($1)", [
    "girish@example.com",
  ]);
  console.log("  First insert: OK");
  try {
    await pool.query("INSERT INTO users (email) VALUES ($1)", [
      "girish@example.com",
    ]);
  } catch (err) {
    const dbErr = err as DatabaseError;
    console.log(
      `  REJECTED! Code: ${dbErr.code}, Constraint: ${dbErr.constraint}`,
    );
    console.log(`  Message: ${dbErr.message}\n`);
  }

  console.log("Test 3: Insert task with non-existent user_id...");
  try {
    await pool.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", [
      "Some task",
      999,
    ]);
  } catch (err) {
    const dbErr = err as DatabaseError;
    console.log(
      `  REJECTED! Code: ${dbErr.code}, Constraint: ${dbErr.constraint}`,
    );
    console.log(`  Message: ${dbErr.message}\n`);
  }

  console.log("Test 4: Graceful error handling in application code...");
  try {
    await pool.query("INSERT INTO users (email) VALUES ($1)", [
      "girish@example.com",
    ]);
  } catch (err) {
    const dbErr = err as DatabaseError;
    if (dbErr.code === "23505") {
      console.log("  Handled gracefully: Email already exists. No crash!");
    } else {
      throw err;
    }
  }

  await pool.query("INSERT INTO users (email) VALUES ($1)", [
    "revanth@example.com",
  ]);
  await pool.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", [
    "Valid task",
    1,
  ]);
  console.log("\n  Valid inserts still work perfectly.");

  const users = await pool.query("SELECT * FROM users");
  const tasks = await pool.query("SELECT * FROM tasks");
  console.log("\nFinal users:");
  console.table(users.rows);
  console.log("Final tasks:");
  console.table(tasks.rows);

  await pool.end();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
