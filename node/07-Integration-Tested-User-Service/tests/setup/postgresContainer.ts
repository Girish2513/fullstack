import { newDb, DataType, IMemoryDb, IBackup } from "pg-mem";
import { readFileSync } from "fs";
import { resolve } from "path";
import { setPool } from "../../src/db/pool";

let db: IMemoryDb;
let backup: IBackup;

export async function startContainer() {
  db = newDb();

  db.public.registerFunction({
    name: "current_setting",
    args: [DataType.text],
    returns: DataType.text,
    implementation: () => "UTC",
  });

  const sql = readFileSync(
    resolve(process.cwd(), "src/db/migrations.sql"),
    "utf-8",
  );

  db.public.none(sql);

  const { Pool } = db.adapters.createPg();
  setPool(new Pool() as any);

  // Seed initial data
  db.public.none(`
    INSERT INTO users(email, name) VALUES('alice@test.com', 'Alice');
    INSERT INTO users(email, name) VALUES('bob@test.com', 'Bob');
    INSERT INTO notes(user_id, content) VALUES(1, 'Alice note 1');
    INSERT INTO notes(user_id, content) VALUES(1, 'Alice note 2');
    INSERT INTO notes(user_id, content) VALUES(2, 'Bob note 1');
  `);

  backup = db.backup();
}

export async function runMigrations() {
  // Already done in startContainer
}

export async function resetDb() {
  backup.restore();
}

export async function stopContainer() {
  // No-op for pg-mem
}
