import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface User {
  id: number;
  email: string;
  created_at: Date;
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  user_id: number | null;
  category_id: number | null;
  created_at: Date;
}

export interface Tag {
  id: number;
  name: string;
}

export async function createUser(email: string): Promise<User> {
  const result = await pool.query<User>(
    "INSERT INTO users (email) VALUES ($1) RETURNING *",
    [email]
  );
  return result.rows[0];
}

export async function createCategory(name: string, color: string): Promise<Category> {
  const result = await pool.query<Category>(
    "INSERT INTO categories (name, color) VALUES ($1, $2) RETURNING *",
    [name, color]
  );
  return result.rows[0];
}

export async function createTask(title: string, userId: number, categoryId?: number): Promise<Task> {
  const result = await pool.query<Task>(
    "INSERT INTO tasks (title, user_id, category_id) VALUES ($1, $2, $3) RETURNING *",
    [title, userId, categoryId || null]
  );
  return result.rows[0];
}

export async function createTag(name: string): Promise<Tag> {
  const result = await pool.query<Tag>(
    "INSERT INTO tags (name) VALUES ($1) RETURNING *",
    [name]
  );
  return result.rows[0];
}

export async function tagTask(taskId: number, tagId: number): Promise<void> {
  await pool.query(
    "INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2)",
    [taskId, tagId]
  );
}

export async function setupTables() {
  await pool.query("DROP TABLE IF EXISTS task_tags");
  await pool.query("DROP TABLE IF EXISTS tags");
  await pool.query("DROP TABLE IF EXISTS comments");
  await pool.query("DROP TABLE IF EXISTS user_preferences");
  await pool.query("DROP TABLE IF EXISTS orders_normalized");
  await pool.query("DROP TABLE IF EXISTS customers");
  await pool.query("DROP TABLE IF EXISTS orders_denormalized");
  await pool.query("DROP TABLE IF EXISTS tasks");
  await pool.query("DROP TABLE IF EXISTS projects");
  await pool.query("DROP TABLE IF EXISTS categories");
  await pool.query("DROP TABLE IF EXISTS users");

  await pool.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE categories (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      color TEXT
    )
  `);

  await pool.query(`
    CREATE TABLE tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL CHECK (LENGTH(title) > 0),
      completed BOOLEAN DEFAULT FALSE,
      user_id INTEGER REFERENCES users(id),
      category_id INTEGER REFERENCES categories(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE tags (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE task_tags (
      task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
      tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (task_id, tag_id)
    )
  `);
}
