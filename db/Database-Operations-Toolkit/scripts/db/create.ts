import dotenv from "dotenv";
dotenv.config();

import { execSync } from "child_process";

const dbUrl = new URL(process.env.DATABASE_URL || "");
const dbName = dbUrl.pathname.slice(1);
const user = dbUrl.username;
const password = dbUrl.password;
const host = dbUrl.hostname;

try {
  execSync(
    `PGPASSWORD=${password} psql -U ${user} -h ${host} -tc "SELECT 1 FROM pg_database WHERE datname = '${dbName}'" | grep -q 1`,
    { stdio: "pipe" }
  );
  console.log(`database '${dbName}' already exists`);
} catch {
  try {
    execSync(`PGPASSWORD=${password} createdb -U ${user} -h ${host} ${dbName}`, { stdio: "pipe" });
    console.log(`created database '${dbName}'`);
  } catch (err) {
    console.error(`failed to create database: ${(err as Error).message}`);
    process.exit(1);
  }
}

const testUrl = process.env.TEST_DATABASE_URL;
if (testUrl) {
  const testDbUrl = new URL(testUrl);
  const testDbName = testDbUrl.pathname.slice(1);
  try {
    execSync(
      `PGPASSWORD=${password} psql -U ${user} -h ${host} -tc "SELECT 1 FROM pg_database WHERE datname = '${testDbName}'" | grep -q 1`,
      { stdio: "pipe" }
    );
    console.log(`database '${testDbName}' already exists`);
  } catch {
    try {
      execSync(`PGPASSWORD=${password} createdb -U ${user} -h ${host} ${testDbName}`, { stdio: "pipe" });
      console.log(`created database '${testDbName}'`);
    } catch {
      console.log(`could not create test database '${testDbName}'`);
    }
  }
}
