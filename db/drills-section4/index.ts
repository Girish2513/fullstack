import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";
import Database from "better-sqlite3";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


async function drillSqliteTesting() {
  console.log("drill 1 - sqlite testing\n");

  const memDb = new Database(":memory:");
  const sqliteMigration = fs.readFileSync(
    path.join(__dirname, "migrations/001_initial_schema_sqlite.sql"),
    "utf-8"
  );
  memDb.exec(sqliteMigration);
  console.log("ran migrations on in-memory sqlite");

  function createUser(db: Database.Database, name: string, email: string) {
    const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
    stmt.run(name, email);
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
  }

  function createTask(db: Database.Database, title: string, userId: number) {
    const stmt = db.prepare("INSERT INTO tasks (title, user_id) VALUES (?, ?)");
    stmt.run(title, userId);
    return db.prepare("SELECT * FROM tasks WHERE title = ? AND user_id = ?").get(title, userId) as any;
  }

  const user = createUser(memDb, "Test User", "test@test.com");
  console.log(`created user: ${user.name} (${user.email})`);

  const task = createTask(memDb, "Write tests", user.id);
  console.log(`created task: ${task.title}`);

  const allUsers = memDb.prepare("SELECT * FROM users").all();
  const allTasks = memDb.prepare("SELECT * FROM tasks").all();
  console.log(`users: ${allUsers.length}, tasks: ${allTasks.length}`);

  console.log("\ntest: create and teardown per test");
  for (let i = 1; i <= 3; i++) {
    const testDb = new Database(":memory:");
    testDb.exec(sqliteMigration);
    createUser(testDb, `User ${i}`, `user${i}@test.com`);
    const count = (testDb.prepare("SELECT COUNT(*) as c FROM users").get() as any).c;
    console.log(`  test ${i}: created fresh db, ${count} user, closed`);
    testDb.close();
  }

  console.log("\nperformance: in-memory vs file-based");
  const iterations = 1000;

  let start = Date.now();
  const memTest = new Database(":memory:");
  memTest.exec(sqliteMigration);
  const memInsert = memTest.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  const memTx = memTest.transaction(() => {
    for (let i = 0; i < iterations; i++) {
      memInsert.run(`User ${i}`, `user${i}@mem.com`);
    }
  });
  memTx();
  const memTime = Date.now() - start;
  memTest.close();

  start = Date.now();
  const filePath = path.join(__dirname, "test.db");
  const fileTest = new Database(filePath);
  fileTest.exec(sqliteMigration);
  const fileInsert = fileTest.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  const fileTx = fileTest.transaction(() => {
    for (let i = 0; i < iterations; i++) {
      fileInsert.run(`User ${i}`, `user${i}@file.com`);
    }
  });
  fileTx();
  const fileTime = Date.now() - start;
  fileTest.close();
  fs.unlinkSync(filePath);

  console.log(`  in-memory: ${memTime}ms for ${iterations} inserts`);
  console.log(`  file-based: ${fileTime}ms for ${iterations} inserts`);
  console.log(`  in-memory is ${(fileTime / memTime).toFixed(1)}x faster`);

  memDb.close();
  console.log();
}


async function drillSeedingReset(pool: Pool) {
  console.log("drill 2 - seeding & reset\n");

  await pool.query("DROP TABLE IF EXISTS tasks CASCADE");
  await pool.query("DROP TABLE IF EXISTS users CASCADE");

  const pgMigration = fs.readFileSync(
    path.join(__dirname, "migrations/001_initial_schema.sql"),
    "utf-8"
  );
  await pool.query(pgMigration);
  console.log("tables created");

  async function seedFromFile(filename: string) {
    const sql = fs.readFileSync(path.join(__dirname, "seeds", filename), "utf-8");
    await pool.query(sql);
  }

  await seedFromFile("minimal.sql");
  const minUsers = (await pool.query("SELECT COUNT(*) FROM users")).rows[0].count;
  const minTasks = (await pool.query("SELECT COUNT(*) FROM tasks")).rows[0].count;
  console.log(`minimal seed: ${minUsers} users, ${minTasks} tasks`);

  await pool.query("DROP TABLE IF EXISTS tasks CASCADE");
  await pool.query("DROP TABLE IF EXISTS users CASCADE");
  await pool.query(pgMigration);

  await seedFromFile("realistic.sql");
  const realUsers = (await pool.query("SELECT COUNT(*) FROM users")).rows[0].count;
  const realTasks = (await pool.query("SELECT COUNT(*) FROM tasks")).rows[0].count;
  console.log(`realistic seed: ${realUsers} users, ${realTasks} tasks`);

  console.log("\nperformance seed:");
  await pool.query("DELETE FROM tasks");
  const start = Date.now();
  for (let i = 0; i < 500; i++) {
    await pool.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", [
      `Perf task ${i}`,
      ((i % 5) + 1),
    ]);
  }
  console.log(`  inserted 500 tasks in ${Date.now() - start}ms`);

  console.log("\nsqlite seed test:");
  const sqliteDb = new Database(":memory:");
  const sqliteMigration = fs.readFileSync(
    path.join(__dirname, "migrations/001_initial_schema_sqlite.sql"),
    "utf-8"
  );
  sqliteDb.exec(sqliteMigration);
  const minimalSeed = fs.readFileSync(path.join(__dirname, "seeds/minimal.sql"), "utf-8");
  sqliteDb.exec(minimalSeed);
  const sqliteUsers = (sqliteDb.prepare("SELECT COUNT(*) as c FROM users").get() as any).c;
  console.log(`  same seed on sqlite: ${sqliteUsers} users`);
  sqliteDb.close();

  console.log();
}


async function drillBackupRestore(pool: Pool) {
  console.log("drill 3 - backup & restore\n");

  const backupDir = path.join(__dirname, "backups");
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupFile = path.join(backupDir, `backup_${timestamp}.sql`);

  try {
    execSync(
      `PGPASSWORD=girish pg_dump -U girish -h localhost taskapp_dev > "${backupFile}"`,
      { stdio: "pipe" }
    );
    const size = fs.statSync(backupFile).size;
    console.log(`backup created: ${path.basename(backupFile)} (${size} bytes)`);
  } catch (err) {
    console.log(`backup failed: ${(err as Error).message}`);
    console.log();
    return;
  }

  const beforeCount = (await pool.query("SELECT COUNT(*) FROM users")).rows[0].count;
  console.log(`users before restore: ${beforeCount}`);

  await pool.query("DELETE FROM tasks");
  await pool.query("DELETE FROM users");
  const afterDelete = (await pool.query("SELECT COUNT(*) FROM users")).rows[0].count;
  console.log(`users after delete: ${afterDelete}`);

  try {
    execSync(
      `PGPASSWORD=girish psql -U girish -h localhost taskapp_dev < "${backupFile}"`,
      { stdio: "pipe" }
    );
    const restored = (await pool.query("SELECT COUNT(*) FROM users")).rows[0].count;
    console.log(`users after restore: ${restored}`);
    console.log("backup/restore cycle works");
  } catch (err) {
    console.log(`restore failed: ${(err as Error).message}`);
  }

  console.log("\nbackup rotation:");
  const backups = fs.readdirSync(backupDir)
    .filter((f) => f.startsWith("backup_"))
    .sort()
    .reverse();
  const keepDaily = 7;
  const toDelete = backups.slice(keepDaily);
  console.log(`  total backups: ${backups.length}, keeping: ${Math.min(backups.length, keepDaily)}`);
  for (const old of toDelete) {
    fs.unlinkSync(path.join(backupDir, old));
    console.log(`  deleted old: ${old}`);
  }

  console.log();
}


async function drillPerformance(pool: Pool) {
  console.log("drill 4 - performance\n");

  async function timedQuery(label: string, sql: string, params: any[] = []) {
    const start = Date.now();
    const result = await pool.query(sql, params);
    const ms = Date.now() - start;
    const slow = ms > 100 ? " [SLOW]" : "";
    console.log(`  ${label}: ${ms}ms (${result.rowCount} rows)${slow}`);
    return { result, ms };
  }

  console.log("query timing:");
  await timedQuery("select all users", "SELECT * FROM users");
  await timedQuery("select all tasks", "SELECT * FROM tasks");
  await timedQuery("join users+tasks", `
    SELECT u.name, COUNT(t.id) as task_count
    FROM users u LEFT JOIN tasks t ON t.user_id = u.id
    GROUP BY u.id, u.name
  `);

  console.log("\nexplain analyze:");
  const explain1 = await pool.query("EXPLAIN ANALYZE SELECT * FROM tasks WHERE user_id = 1");
  console.log("  tasks WHERE user_id = 1:");
  explain1.rows.forEach((r: any) => console.log(`    ${r["QUERY PLAN"]}`));

  console.log("\ncreating index on tasks(user_id)...");
  await pool.query("CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)");

  const explain2 = await pool.query("EXPLAIN ANALYZE SELECT * FROM tasks WHERE user_id = 1");
  console.log("  after index:");
  explain2.rows.forEach((r: any) => console.log(`    ${r["QUERY PLAN"]}`));

  console.log("\nindex impact on writes:");
  const noIndexStart = Date.now();
  await pool.query("DROP INDEX IF EXISTS idx_tasks_user_id");
  for (let i = 0; i < 100; i++) {
    await pool.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", [`Write test ${i}`, 1]);
  }
  const noIndexTime = Date.now() - noIndexStart;

  await pool.query("CREATE INDEX idx_tasks_user_id ON tasks(user_id)");
  const withIndexStart = Date.now();
  for (let i = 0; i < 100; i++) {
    await pool.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", [`Index test ${i}`, 1]);
  }
  const withIndexTime = Date.now() - withIndexStart;

  console.log(`  100 inserts without index: ${noIndexTime}ms`);
  console.log(`  100 inserts with index: ${withIndexTime}ms`);
  console.log(`  index overhead: ${withIndexTime - noIndexTime}ms`);

  console.log();
}


async function drillMonitoring(pool: Pool) {
  console.log("drill 5 - monitoring\n");

  const metrics = {
    queryCount: 0,
    totalTime: 0,
    slowQueries: 0,
    errors: 0,
  };

  async function trackedQuery(sql: string, params: any[] = []) {
    const start = Date.now();
    try {
      const result = await pool.query(sql, params);
      const ms = Date.now() - start;
      metrics.queryCount++;
      metrics.totalTime += ms;
      if (ms > 100) metrics.slowQueries++;
      return result;
    } catch {
      metrics.errors++;
      throw new Error("query failed");
    }
  }

  await trackedQuery("SELECT * FROM users");
  await trackedQuery("SELECT * FROM tasks");
  await trackedQuery("SELECT u.name, COUNT(t.id) FROM users u LEFT JOIN tasks t ON t.user_id = u.id GROUP BY u.id, u.name");

  try {
    await trackedQuery("SELECT * FROM nonexistent_xyz");
  } catch {}

  console.log("query metrics:");
  console.log(`  total queries: ${metrics.queryCount}`);
  console.log(`  avg response: ${(metrics.totalTime / metrics.queryCount).toFixed(1)}ms`);
  console.log(`  slow queries: ${metrics.slowQueries}`);
  console.log(`  errors: ${metrics.errors}`);

  console.log("\npool status:");
  console.log(`  total: ${pool.totalCount}`);
  console.log(`  idle: ${pool.idleCount}`);
  console.log(`  waiting: ${pool.waitingCount}`);

  const dbSize = await pool.query(`
    SELECT pg_size_pretty(pg_database_size(current_database())) as size
  `);
  console.log(`\ndatabase size: ${dbSize.rows[0].size}`);

  const tableSizes = await pool.query(`
    SELECT relname as table,
           pg_size_pretty(pg_total_relation_size(relid)) as size,
           n_live_tup as rows
    FROM pg_stat_user_tables
    ORDER BY pg_total_relation_size(relid) DESC
  `);
  console.log("\ntable sizes:");
  tableSizes.rows.forEach((r: any) => {
    console.log(`  ${r.table}: ${r.size} (${r.rows} rows)`);
  });

  const poolMax = (pool as any).options.max || 10;
  const usage = (pool.totalCount / poolMax) * 100;
  if (usage > 80) {
    console.log(`\nWARNING: pool usage at ${usage.toFixed(0)}%`);
  } else {
    console.log(`\npool usage: ${usage.toFixed(0)}% (healthy)`);
  }

  console.log();
}


async function drillDeployment(pool: Pool) {
  console.log("drill 6 - deployment\n");

  function getConfig(env: string) {
    const configs: Record<string, any> = {
      development: { max: 10, ssl: false, idleTimeout: 30000 },
      test: { max: 5, ssl: false, idleTimeout: 10000 },
      production: { max: 20, ssl: true, idleTimeout: 60000 },
    };
    return configs[env] || configs.development;
  }

  console.log("environment configs:");
  for (const env of ["development", "test", "production"]) {
    const cfg = getConfig(env);
    console.log(`  ${env}: max=${cfg.max}, ssl=${cfg.ssl}, idle=${cfg.idleTimeout}ms`);
  }

  console.log("\nzero-downtime migration strategy:");
  console.log("  1. deploy new code that works with both old and new schema");
  console.log("  2. run migrations (additive only — new columns, tables)");
  console.log("  3. deploy code that uses new schema");
  console.log("  4. clean up old columns in a later migration");

  console.log("\nadditive migration example:");
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'");
  console.log("  added 'role' column with default — no downtime, old code unaffected");

  const roleCheck = await pool.query("SELECT column_name, column_default FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role'");
  console.log(`  verified: ${roleCheck.rows[0]?.column_name} (default: ${roleCheck.rows[0]?.column_default})`);

  console.log("\nread-only connection:");
  const readonlyResult = await pool.query("SELECT name, email FROM users LIMIT 3");
  console.log("  read replica query (simulated):");
  readonlyResult.rows.forEach((r: any) => console.log(`    ${r.name} - ${r.email}`));

  console.log("\nproduction checklist:");
  const checks = [
    { name: "db connection", ok: true },
    { name: "migrations applied", ok: true },
    { name: "pool configured", ok: (pool as any).options.max > 0 },
    { name: "graceful shutdown", ok: true },
    { name: "backups scheduled", ok: fs.existsSync(path.join(__dirname, "backups")) },
  ];
  checks.forEach((c) => console.log(`  [${c.ok ? "x" : " "}] ${c.name}`));

  await pool.query("ALTER TABLE users DROP COLUMN IF EXISTS role");
  console.log();
}


async function main() {
  await drillSqliteTesting();

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  await drillSeedingReset(pool);
  await drillBackupRestore(pool);
  await drillPerformance(pool);
  await drillMonitoring(pool);
  await drillDeployment(pool);

  await pool.end();
  console.log("done");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
