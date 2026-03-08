import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "fs-extra";
import { loadConfig } from "../config/loadConfig.js";

let db: ReturnType<typeof drizzle>;

export async function getDB() {
  if (db) return db;

  const config = await loadConfig();

  await fs.ensureDir(".data");

  const sqlite = new Database(config.dbPath);
  db = drizzle(sqlite);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    )
  `);

  return db;
}
