import dotenv from "dotenv";
import { Pool } from "./node_modules/@types/pg/index.js";

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
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      user_id INTEGER REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log("Created tables with foreign key relationship.\n");

  const girish = await pool.query(
    "INSERT INTO users (email) VALUES ($1) RETURNING *",
    ["girish@example.com"],
  );
  const revanth = await pool.query(
    "INSERT INTO users (email) VALUES ($1) RETURNING *",
    ["revanth@example.com"],
  );
  console.log("Inserted users: Girish (id=1), Revanth (id=2)");

  await pool.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", [
    "Write SQL queries",
    girish.rows[0].id,
  ]);
  await pool.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", [
    "Learn TypeScript",
    girish.rows[0].id,
  ]);
  await pool.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", [
    "Deploy to production",
    revanth.rows[0].id,
  ]);
  await pool.query("INSERT INTO tasks (title) VALUES ($1)", [
    "Unassigned task",
  ]);
  console.log("Inserted 4 tasks (3 assigned, 1 unassigned).\n");

  const girishTasks = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1",
    [girish.rows[0].id],
  );
  console.log("Girish's tasks:");
  console.table(girishTasks.rows);

  const joinResult = await pool.query(`
    SELECT t.id, t.title, t.completed, u.email
    FROM tasks t
    JOIN users u ON t.user_id = u.id
    ORDER BY t.id
  `);
  console.log("JOIN - Tasks with user emails (excludes unassigned):");
  console.table(joinResult.rows);

  const leftJoinResult = await pool.query(`
    SELECT t.id, t.title, t.completed, u.email
    FROM tasks t
    LEFT JOIN users u ON t.user_id = u.id
    ORDER BY t.id
  `);
  console.log("LEFT JOIN - All tasks (unassigned shows NULL email):");
  console.table(leftJoinResult.rows);

  await pool.end();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
