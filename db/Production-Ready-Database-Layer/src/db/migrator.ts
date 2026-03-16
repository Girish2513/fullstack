import * as fs from "fs";
import * as path from "path";
import { pool } from "./database.js";
import type { MigrationRecord } from "../types/index.js";

const MIGRATIONS_DIR = path.join(process.cwd(), "migrations");

async function ensureMigrationsTable() {
  await pool().query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrations(): Promise<string[]> {
  const result = await pool().query<MigrationRecord>("SELECT filename FROM migrations ORDER BY id");
  return result.rows.map((r) => r.filename);
}

export async function runMigrations(): Promise<number> {
  await ensureMigrationsTable();

  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const applied = await getAppliedMigrations();
  let count = 0;

  for (const file of files) {
    if (applied.includes(file)) {
      console.log(`  skip: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8");
    await pool().query(sql);
    await pool().query("INSERT INTO migrations (filename) VALUES ($1)", [file]);
    console.log(`  applied: ${file}`);
    count++;
  }

  return count;
}

export async function rollbackLast(): Promise<string | null> {
  await ensureMigrationsTable();

  const result = await pool().query<MigrationRecord>(
    "SELECT * FROM migrations ORDER BY id DESC LIMIT 1"
  );

  if (result.rows.length === 0) return null;

  const last = result.rows[0]!;

  if (last.filename === "003_add_metadata.sql") {
    await pool().query("DROP INDEX IF EXISTS idx_tasks_metadata");
    await pool().query("DROP INDEX IF EXISTS idx_tasks_user");
    await pool().query("DROP INDEX IF EXISTS idx_tasks_project");
    await pool().query("ALTER TABLE tasks DROP COLUMN IF EXISTS metadata");
  } else if (last.filename === "002_add_categories.sql") {
    await pool().query("ALTER TABLE tasks DROP COLUMN IF EXISTS category_id");
    await pool().query("DROP TABLE IF EXISTS categories");
  } else if (last.filename === "001_initial_schema.sql") {
    await pool().query("DROP TABLE IF EXISTS tasks");
    await pool().query("DROP TABLE IF EXISTS projects");
    await pool().query("DROP TABLE IF EXISTS users");
  }

  await pool().query("DELETE FROM migrations WHERE id = $1", [last.id]);
  return last.filename;
}

export async function resetDatabase() {
  await pool().query("DROP TABLE IF EXISTS tasks CASCADE");
  await pool().query("DROP TABLE IF EXISTS projects CASCADE");
  await pool().query("DROP TABLE IF EXISTS categories CASCADE");
  await pool().query("DROP TABLE IF EXISTS users CASCADE");
  await pool().query("DROP TABLE IF EXISTS migrations CASCADE");
}
