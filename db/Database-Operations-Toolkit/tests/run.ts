import dotenv from "dotenv";
dotenv.config();

import { createTestDb, seedTestDb } from "./helpers/sqlite-db.js";
import { assert, getResults } from "./helpers/assert.js";
import { UserRepository } from "../src/repositories/UserRepository.js";
import { TaskRepository } from "../src/repositories/TaskRepository.js";
import { healthCheck, withTransaction, mapPgError, closePool, getMetrics, resetMetrics } from "../src/db/database.js";
import { resetDatabase, runMigrations } from "../src/db/migrator.js";
import type { DatabaseError } from "pg";

const userRepo = new UserRepository();
const taskRepo = new TaskRepository();

async function testSqlite() {
  console.log("\n1. sqlite unit tests");

  const db = createTestDb();
  seedTestDb(db);

  const users = db.prepare("SELECT * FROM users").all() as any[];
  assert(users.length === 2, "created 2 users");

  const tasks = db.prepare("SELECT * FROM tasks").all() as any[];
  assert(tasks.length === 3, "created 3 tasks");

  const userTasks = db.prepare("SELECT * FROM tasks WHERE user_id = ?").all(1) as any[];
  assert(userTasks.length === 2, "user 1 has 2 tasks");

  db.prepare("UPDATE tasks SET completed = 1 WHERE id = ?").run(1);
  const completed = db.prepare("SELECT * FROM tasks WHERE id = ?").get(1) as any;
  assert(completed.completed === 1, "task marked complete");

  db.prepare("DELETE FROM tasks WHERE id = ?").run(3);
  const remaining = db.prepare("SELECT COUNT(*) as c FROM tasks").get() as any;
  assert(remaining.c === 2, "task deleted");

  db.close();

  const db2 = createTestDb();
  const empty = db2.prepare("SELECT COUNT(*) as c FROM users").get() as any;
  assert(empty.c === 0, "fresh db is empty (isolation)");
  db2.close();
}

async function testHealthCheck() {
  console.log("\n2. health check");
  const health = await healthCheck();
  assert(health.status === "healthy", "db healthy");
  assert(health.latency < 1000, `latency ${health.latency}ms ok`);
  assert(health.pool.max > 0, "pool configured");
}

async function testRepositories() {
  console.log("\n3. repositories");
  const user = await userRepo.create("Test User", "test@test.com");
  assert(user.name === "Test User", "create user");

  const found = await userRepo.findById(user.id);
  assert(found?.email === "test@test.com", "find by id");

  const byEmail = await userRepo.findByEmail("test@test.com");
  assert(byEmail?.id === user.id, "find by email");

  const task = await taskRepo.create("Test task", user.id);
  assert(task.title === "Test task", "create task");

  const completed = await taskRepo.markComplete(task.id);
  assert(completed?.completed === true, "mark complete");

  assert((await userRepo.count()) >= 1, "user count");
  assert((await taskRepo.count()) >= 1, "task count");
}

async function testTransactions() {
  console.log("\n4. transactions");

  const result = await withTransaction(async (client) => {
    const u = (await client.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", ["TxUser", "tx@test.com"])).rows[0];
    await client.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", ["TxTask", u!.id]);
    return u;
  });
  assert(result?.name === "TxUser", "commit works");

  const before = await userRepo.count();
  try {
    await withTransaction(async (client) => {
      await client.query("INSERT INTO users (name, email) VALUES ($1, $2)", ["Ghost", "ghost@test.com"]);
      await client.query("INSERT INTO users (name, email) VALUES ($1, $2)", ["Dup", "test@test.com"]);
    });
  } catch {}
  const after = await userRepo.count();
  assert(before === after, "rollback works");
}

async function testErrorMapping() {
  console.log("\n5. error mapping");
  try {
    await userRepo.create("Dup", "test@test.com");
  } catch (err) {
    const mapped = mapPgError(err as DatabaseError);
    assert(mapped.status === 409, "unique -> 409");
  }
}

async function testMetrics() {
  console.log("\n6. metrics");
  resetMetrics();
  await userRepo.findAll();
  await taskRepo.findAll();
  const m = getMetrics();
  assert(m.queryCount === 2, "tracked 2 queries");
  assert(m.avgTime >= 0, "avg time calculated");
}

async function testTransactionWithTasks() {
  console.log("\n7. create project with tasks");
  const user = await userRepo.findByEmail("test@test.com");
  if (user) {
    const result = await taskRepo.createProjectWithTasks("Atomic Project", user.id, ["A", "B", "C"]);
    assert(result.tasks.length === 3, "3 tasks created atomically");
  }
}

async function testPerformance() {
  console.log("\n8. performance");
  const start = Date.now();
  for (let i = 0; i < 50; i++) {
    await taskRepo.findAll();
  }
  const ms = Date.now() - start;
  console.log(`  50 findAll queries: ${ms}ms (${(ms / 50).toFixed(1)}ms avg)`);
  assert(ms < 5000, "50 queries under 5s");
}

async function main() {
  console.log("setting up test db...");
  await resetDatabase();
  await runMigrations();

  await testSqlite();
  await testHealthCheck();
  await testRepositories();
  await testTransactions();
  await testErrorMapping();
  await testMetrics();
  await testTransactionWithTasks();
  await testPerformance();

  const { passed, failed } = getResults();
  console.log(`\nresults: ${passed} passed, ${failed} failed`);
  await closePool();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
