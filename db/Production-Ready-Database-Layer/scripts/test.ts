import dotenv from "dotenv";
dotenv.config();

import { pool, withTransaction, healthCheck, closePool, mapPgError } from "../src/db/database.js";
import { UserRepository } from "../src/repositories/UserRepository.js";
import { TaskRepository } from "../src/repositories/TaskRepository.js";
import { resetDatabase, runMigrations } from "../src/db/migrator.js";
import type { DatabaseError } from "pg";

const userRepo = new UserRepository();
const taskRepo = new TaskRepository();
let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    console.log(`  pass: ${label}`);
    passed++;
  } else {
    console.log(`  FAIL: ${label}`);
    failed++;
  }
}

async function main() {
  console.log("setting up test db...");
  await resetDatabase();
  await runMigrations();

  console.log("\n1. health check");
  const health = await healthCheck();
  assert(health.status === "healthy", "db is healthy");
  assert(health.latency < 1000, `latency ${health.latency}ms < 1000ms`);

  console.log("\n2. user repository");
  const user = await userRepo.create("Test User", "test@example.com");
  assert(user.name === "Test User", "create user");
  const found = await userRepo.findById(user.id);
  assert(found?.email === "test@example.com", "find by id");
  const byEmail = await userRepo.findByEmail("test@example.com");
  assert(byEmail?.id === user.id, "find by email");
  assert((await userRepo.count()) === 1, "count = 1");

  console.log("\n3. task repository");
  const task = await taskRepo.create("Test task", user.id);
  assert(task.title === "Test task", "create task");
  const completed = await taskRepo.markComplete(task.id);
  assert(completed?.completed === true, "mark complete");
  const userTasks = await taskRepo.findByUser(user.id);
  assert(userTasks.length === 1, "find by user");

  console.log("\n4. transaction - success");
  const result = await withTransaction(async (client) => {
    const u = (await client.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", ["TxUser", "tx@test.com"])).rows[0];
    await client.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", ["TxTask", u!.id]);
    return u;
  });
  assert(result?.name === "TxUser", "transaction committed");

  console.log("\n5. transaction - rollback");
  const countBefore = await userRepo.count();
  try {
    await withTransaction(async (client) => {
      await client.query("INSERT INTO users (name, email) VALUES ($1, $2)", ["Ghost", "ghost@test.com"]);
      await client.query("INSERT INTO users (name, email) VALUES ($1, $2)", ["Dup", "test@example.com"]);
    });
  } catch {}
  const countAfter = await userRepo.count();
  assert(countBefore === countAfter, "rollback worked, count unchanged");

  console.log("\n6. error mapping");
  try {
    await userRepo.create("Dup", "test@example.com");
  } catch (err) {
    const mapped = mapPgError(err as DatabaseError);
    assert(mapped.status === 409, "unique violation -> 409");
  }

  try {
    await pool().query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", ["x", 99999]);
  } catch (err) {
    const mapped = mapPgError(err as DatabaseError);
    assert(mapped.status === 400, "fk violation -> 400");
  }

  console.log("\n7. create project with tasks (transaction)");
  const projectResult = await taskRepo.createProjectWithTasks("Test Project", user.id, ["Task A", "Task B"]);
  assert(projectResult.tasks.length === 2, "created 2 tasks atomically");

  console.log(`\nresults: ${passed} passed, ${failed} failed`);
  await closePool();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
