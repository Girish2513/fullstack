import dotenv from "dotenv";
dotenv.config();

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

async function main() {
  const backupDir = path.join(process.cwd(), "backups");
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

  const dbUrl = new URL(process.env.DATABASE_URL || "");
  const dbName = dbUrl.pathname.slice(1);
  const user = dbUrl.username;
  const password = dbUrl.password;
  const host = dbUrl.hostname;

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupFile = path.join(backupDir, `${dbName}_${timestamp}.sql`);

  console.log(`backing up ${dbName}...`);
  execSync(`PGPASSWORD=${password} pg_dump -U ${user} -h ${host} ${dbName} > "${backupFile}"`, {
    stdio: "pipe",
  });

  const size = fs.statSync(backupFile).size;
  console.log(`backup created: ${path.basename(backupFile)} (${(size / 1024).toFixed(1)} KB)`);

  const backups = fs.readdirSync(backupDir).filter((f) => f.endsWith(".sql")).sort().reverse();
  const keepDaily = 7;
  const keepWeekly = 4;
  const keep = keepDaily + keepWeekly;

  if (backups.length > keep) {
    const toDelete = backups.slice(keep);
    for (const old of toDelete) {
      fs.unlinkSync(path.join(backupDir, old));
      console.log(`  deleted old: ${old}`);
    }
  }
  console.log(`total backups: ${Math.min(backups.length, keep)}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
