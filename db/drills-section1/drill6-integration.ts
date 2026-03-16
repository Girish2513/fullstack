import dotenv from "dotenv";
import { Pool, DatabaseError } from "./node_modules/@types/pg/index.js";

dotenv.config();

interface User {
  id: number;
  email: string;
  created_at: Date;
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
  user_id: number | null;
  created_at: Date;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected pool error:", err.message);
});

async function getUser(id: number): Promise<User | null> {
  const result = await pool.query<User>("SELECT * FROM users WHERE id = $1", [
    id,
  ]);
  return result.rows[0] || null;
}

async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query<User>(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );
  return result.rows[0] || null;
}

async function createUser(email: string): Promise<User> {
  const result = await pool.query<User>(
    "INSERT INTO users (email) VALUES ($1) RETURNING *",
    [email],
  );
  return result.rows[0];
}

async function createTask(userId: number, title: string): Promise<Task> {
  const result = await pool.query<Task>(
    "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
    [title, userId],
  );
  return result.rows[0];
}

async function getUserTasks(userId: number): Promise<Task[]> {
  const result = await pool.query<Task>(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  );
  return result.rows;
}

async function completeTask(taskId: number): Promise<Task | null> {
  const result = await pool.query<Task>(
    "UPDATE tasks SET completed = true WHERE id = $1 RETURNING *",
    [taskId],
  );
  return result.rows[0] || null;
}

function setupGracefulShutdown() {
  const shutdown = async () => {
    console.log("\nShutting down gracefully...");
    await pool.end();
    console.log("Database pool closed.");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

async function main() {
  setupGracefulShutdown();

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

  console.log("Using typed database functions\n");

  const girish = await createUser("girish@example.com");
  console.log("Created user:", girish);

  const revanth = await createUser("revanth@example.com");
  console.log("Created user:", revanth);

  const task1 = await createTask(girish.id, "Learn database integration");
  const task2 = await createTask(girish.id, "Write TypeScript interfaces");
  const task3 = await createTask(revanth.id, "Review pull request");
  console.log("\nCreated 3 tasks.");

  const completed = await completeTask(task1.id);
  console.log("\nCompleted task:", completed?.title);

  const foundUser = await getUser(girish.id);
  console.log("\nFound user by id:", foundUser?.email);

  const foundByEmail = await getUserByEmail("revanth@example.com");
  console.log("Found user by email:", foundByEmail?.email);

  const notFound = await getUser(999);
  console.log("Non-existent user:", notFound);

  const girishTasks = await getUserTasks(girish.id);
  console.log("\nGirish's tasks:");
  girishTasks.forEach((t) => {
    console.log(`[${t.completed ? "x" : " "}] ${t.title}`);
  });

  try {
    await createUser("girish@example.com");
  } catch (err) {
    const dbErr = err as DatabaseError;
    if (dbErr.code === "23505") {
      console.log("\nHandled: Email girish@example.com already taken.");
    }
  }

  await pool.end();
  console.log("\nDone! Pool closed.");
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  pool.end();
  process.exit(1);
});
