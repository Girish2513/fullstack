import dotenv from "dotenv";
dotenv.config();

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

async function main() {
  const file = process.argv[2];

  if (!file) {
    const backupDir = path.join(process.cwd(), "backups");
    if (fs.existsSync(backupDir)) {
      const backups = fs.readdirSync(backupDir).filter((f) => f.endsWith(".sql")).sort().reverse();
      console.log("available backups:");
      backups.forEach((b) => console.log(`  ${b}`));
    }
    console.error("\nusage: npm run db:restore <backup-file>");
    process.exit(1);
  }

  const backupPath = path.isAbsolute(file) ? file : path.join(process.cwd(), "backups", file);
  if (!fs.existsSync(backupPath)) {
    console.error(`file not found: ${backupPath}`);
    process.exit(1);
  }

  const dbUrl = new URL(process.env.DATABASE_URL || "");
  const dbName = dbUrl.pathname.slice(1);
  const user = dbUrl.username;
  const password = dbUrl.password;
  const host = dbUrl.hostname;

  console.log(`restoring ${dbName} from ${path.basename(backupPath)}...`);
  execSync(`PGPASSWORD=${password} psql -U ${user} -h ${host} ${dbName} < "${backupPath}"`, {
    stdio: "pipe",
  });

  console.log("restore complete");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
