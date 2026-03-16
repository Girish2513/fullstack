import * as fs from "fs";
import * as path from "path";
import { getPool } from "./database.js";
import type { MigrationRecord } from "../types/index.js";

const MIGRATIONS_DIR = path.join(process.cwd(), "migrations");

async function ensureMigrationsTable() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function getApplied(): Promise<string[]> {
  const result = await getPool().query<MigrationRecord>("SELECT filename FROM migrations ORDER BY id");
  return result.rows.map((r) => r.filename);
}

export async function runMigrations(): Promise<number> {
  await ensureMigrationsTable();
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql") && !f.includes("sqlite"))
    .sort();

  const applied = await getApplied();
  let count = 0;

  for (const file of files) {
    if (applied.includes(file)) {
      console.log(`  skip: ${file}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8");
    await getPool().query(sql);
    await getPool().query("INSERT INTO migrations (filename) VALUES ($1)", [file]);
    console.log(`  applied: ${file}`);
    count++;
  }
  return count;
}

export async function rollbackLast(): Promise<string | null> {
  await ensureMigrationsTable();
  const result = await getPool().query<MigrationRecord>(
    "SELECT * FROM migrations ORDER BY id DESC LIMIT 1"
  );
  if (result.rows.length === 0) return null;

  const last = result.rows[0]!;

  if (last.filename === "001_initial_schema.sql") {
    await getPool().query("DROP TABLE IF EXISTS tasks CASCADE");
    await getPool().query("DROP TABLE IF EXISTS projects CASCADE");
    await getPool().query("DROP TABLE IF EXISTS users CASCADE");
  }

  await getPool().query("DELETE FROM migrations WHERE id = $1", [last.id]);
  return last.filename;
}

export async function resetDatabase() {
  await getPool().query("DROP TABLE IF EXISTS tasks CASCADE");
  await getPool().query("DROP TABLE IF EXISTS projects CASCADE");
  await getPool().query("DROP TABLE IF EXISTS users CASCADE");
  await getPool().query("DROP TABLE IF EXISTS migrations CASCADE");
}
