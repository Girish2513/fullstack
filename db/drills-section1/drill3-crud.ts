import dotenv from "dotenv";
import { Pool } from "./node_modules/@types/pg/index.js";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await pool.query("DROP TABLE IF EXISTS tasks");
  await pool.query(`
    CREATE TABLE tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  const createResult = await pool.query(
    "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
    ["Learn CRUD operations"],
  );
  console.log("CREATE - Inserted task:");
  console.log(createResult.rows[0]);

  await pool.query("INSERT INTO tasks (title) VALUES ($1)", [
    "Practice SQL joins",
  ]);
  await pool.query("INSERT INTO tasks (title) VALUES ($1)", ["Build REST API"]);

  const allTasks = await pool.query("SELECT * FROM tasks");
  console.log("\nREAD - All tasks:");
  console.table(allTasks.rows);

  const incompleteTasks = await pool.query(
    "SELECT * FROM tasks WHERE completed = $1",
    [false],
  );
  console.log("READ - Incomplete tasks:", incompleteTasks.rows.length, "found");

  const updateResult = await pool.query(
    "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
    [true, 1],
  );
  console.log("\nUPDATE - Marked task as complete:");
  console.log(updateResult.rows[0]);

  const deleteResult = await pool.query(
    "DELETE FROM tasks WHERE id = $1 RETURNING *",
    [2],
  );
  console.log("\nDELETE - Removed task:");
  console.log(deleteResult.rows[0]);

  const finalTasks = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
  console.log("\nFinal state of tasks table:");
  console.table(finalTasks.rows);

  await pool.end();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
