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

  backup = db.backup();
}

export async function resetDb() {
  backup.restore();
}

export async function stopContainer() {
  // No-op for pg-mem
}
