import Database from "better-sqlite3";
import * as fs from "fs";
import * as path from "path";

const SQLITE_MIGRATION = path.join(process.cwd(), "migrations", "001_initial_schema_sqlite.sql");

export function createTestDb(): Database.Database {
  const db = new Database(":memory:");
  const sql = fs.readFileSync(SQLITE_MIGRATION, "utf-8");
  db.exec(sql);
  return db;
}

export function seedTestDb(db: Database.Database) {
  db.exec(`
    INSERT INTO users (name, email) VALUES ('Test User', 'test@test.com');
    INSERT INTO users (name, email) VALUES ('Other User', 'other@test.com');
    INSERT INTO projects (name, owner_id) VALUES ('Test Project', 1);
    INSERT INTO tasks (title, user_id, project_id) VALUES ('Task 1', 1, 1);
    INSERT INTO tasks (title, user_id, project_id) VALUES ('Task 2', 1, 1);
    INSERT INTO tasks (title, user_id, project_id) VALUES ('Task 3', 2, 1);
  `);
}
