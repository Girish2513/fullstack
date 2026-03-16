import dotenv from "dotenv";
import { Pool, PoolConfig, PoolClient, DatabaseError } from "pg";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

interface MigrationRecord {
  id: number;
  filename: string;
  applied_at: Date;
}

interface User {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
  user_id: number | null;
  category_id: number | null;
  metadata: Record<string, unknown>;
  created_at: Date;
}


async function drillMigrations(pool: Pool) {
  console.log("drill 1\n");

  await pool.query("DROP TABLE IF EXISTS tasks CASCADE");
  await pool.query("DROP TABLE IF EXISTS categories CASCADE");
  await pool.query("DROP TABLE IF EXISTS users CASCADE");
  await pool.query("DROP TABLE IF EXISTS migrations CASCADE");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log("created migrations tracking table");

  async function getAppliedMigrations(): Promise<string[]> {
    const result = await pool.query<MigrationRecord>(
      "SELECT filename FROM migrations ORDER BY id",
    );
    return result.rows.map((r) => r.filename);
  }

  async function runMigrations() {
    const migrationsDir = path.join(__dirname, "migrations");
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    const applied = await getAppliedMigrations();
    let newCount = 0;

    for (const file of files) {
      if (applied.includes(file)) {
        console.log(`  skip: ${file} (already applied)`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      await pool.query(sql);
      await pool.query("INSERT INTO migrations (filename) VALUES ($1)", [file]);
      console.log(`  applied: ${file}`);
      newCount++;
    }

    return newCount;
  }

  async function rollbackLast() {
    const result = await pool.query<MigrationRecord>(
      "SELECT * FROM migrations ORDER BY id DESC LIMIT 1",
    );
    if (result.rows.length === 0) {
      console.log("  nothing to rollback");
      return;
    }

    const last = result.rows[0];
    console.log(`  rolling back: ${last.filename}`);

    if (last.filename === "003_add_metadata.sql") {
      await pool.query("DROP INDEX IF EXISTS idx_tasks_metadata");
      await pool.query("ALTER TABLE tasks DROP COLUMN IF EXISTS metadata");
    } else if (last.filename === "002_add_categories.sql") {
      await pool.query("ALTER TABLE tasks DROP COLUMN IF EXISTS category_id");
      await pool.query("DROP TABLE IF EXISTS categories");
    } else if (last.filename === "001_initial_schema.sql") {
      await pool.query("DROP TABLE IF EXISTS tasks");
      await pool.query("DROP TABLE IF EXISTS users");
    }

    await pool.query("DELETE FROM migrations WHERE id = $1", [last.id]);
    console.log(`  rolled back: ${last.filename}`);
  }

  console.log("\nfirst run (apply all 3):");
  const count1 = await runMigrations();
  console.log(`applied ${count1} migrations\n`);

  console.log("second run (idempotent, should skip all):");
  const count2 = await runMigrations();
  console.log(`applied ${count2} migrations\n`);

  const applied = await getAppliedMigrations();
  console.log("applied migrations:", applied);

  console.log("\nrollback last:");
  await rollbackLast();
  console.log("\nre-apply after rollback:");
  await runMigrations();
  console.log();
}


function createManagedPool(): Pool {
  const config: PoolConfig = {
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };

  const pool = new Pool(config);

  pool.on("error", (err) => {
    console.error("pool error:", err.message);
  });

  return pool;
}

async function drillConnectionManagement(pool: Pool) {
  console.log("drill 2\n");

  console.log("pool config:");
  console.log(`  max: ${(pool as any).options.max || 10}`);
  console.log(`  idle timeout: ${(pool as any).options.idleTimeoutMillis || 30000}ms`);
  console.log(`  connection timeout: ${(pool as any).options.connectionTimeoutMillis || 5000}ms`);

  async function healthCheck(): Promise<{ status: string; latency: number }> {
    const start = Date.now();
    try {
      await pool.query("SELECT 1");
      return { status: "healthy", latency: Date.now() - start };
    } catch {
      return { status: "unhealthy", latency: Date.now() - start };
    }
  }

  const health = await healthCheck();
  console.log(`\nhealth check: ${health.status} (${health.latency}ms)`);

  async function queryWithRetry(sql: string, params: any[] = [], retries = 3): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await pool.query(sql, params);
      } catch (err) {
        console.log(`  attempt ${attempt} failed: ${(err as Error).message}`);
        if (attempt === retries) throw err;
        await new Promise((r) => setTimeout(r, 100 * attempt));
      }
    }
  }

  console.log("\nretry test (valid query):");
  const result = await queryWithRetry("SELECT NOW() AS time");
  console.log(`  success: ${result.rows[0].time}`);

  console.log("\nretry test (invalid query, will fail 3 times):");
  try {
    await queryWithRetry("SELECT * FROM nonexistent_table_xyz");
  } catch {
    console.log("  all retries exhausted");
  }

  console.log("\npool status:", {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received, closing pool...`);
    await pool.end();
    process.exit(0);
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  console.log("graceful shutdown registered\n");
}


class BaseRepository<T extends Record<string, any>> {
  constructor(protected tableName: string, protected pool: Pool) {}

  async findById(id: number): Promise<T | null> {
    const result = await this.pool.query<T>(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id],
    );
    return result.rows[0] || null;
  }

  async findAll(): Promise<T[]> {
    const result = await this.pool.query<T>(`SELECT * FROM ${this.tableName} ORDER BY id`);
    return result.rows;
  }

  async deleteById(id: number): Promise<T | null> {
    const result = await this.pool.query<T>(
      `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`,
      [id],
    );
    return result.rows[0] || null;
  }

  async count(): Promise<number> {
    const result = await this.pool.query(`SELECT COUNT(*) FROM ${this.tableName}`);
    return parseInt(result.rows[0].count);
  }
}

class UserRepo extends BaseRepository<User> {
  constructor(pool: Pool) {
    super("users", pool);
  }

  async create(name: string, email: string): Promise<User> {
    const result = await this.pool.query<User>(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email],
    );
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    return result.rows[0] || null;
  }
}

class TaskRepo extends BaseRepository<Task> {
  constructor(pool: Pool) {
    super("tasks", pool);
  }

  async create(title: string, userId: number): Promise<Task> {
    const result = await this.pool.query<Task>(
      "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, userId],
    );
    return result.rows[0];
  }

  async findByUser(userId: number): Promise<Task[]> {
    const result = await this.pool.query<Task>(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );
    return result.rows;
  }

  async markComplete(id: number): Promise<Task | null> {
    const result = await this.pool.query<Task>(
      "UPDATE tasks SET completed = true WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0] || null;
  }
}

async function drillRepositoryPattern(pool: Pool) {
  console.log("drill 3\n");

  const userRepo = new UserRepo(pool);
  const taskRepo = new TaskRepo(pool);

  const girish = await userRepo.create("Girish", "girish@example.com");
  const revanth = await userRepo.create("Revanth", "revanth@example.com");
  console.log("created users");

  const t1 = await taskRepo.create("Build migration system", girish.id);
  await taskRepo.create("Write repository pattern", girish.id);
  const t3 = await taskRepo.create("Review code", revanth.id);
  console.log("created tasks");

  const found = await userRepo.findById(girish.id);
  console.log(`findById: ${found?.name} (${found?.email})`);

  const byEmail = await userRepo.findByEmail("revanth@example.com");
  console.log(`findByEmail: ${byEmail?.name}`);

  console.log(`findAll: ${(await userRepo.findAll()).length} users`);
  console.log(`count: ${await userRepo.count()} users`);

  const girishTasks = await taskRepo.findByUser(girish.id);
  console.log(`\nfindByUser: ${girishTasks.length} tasks for Girish`);
  girishTasks.forEach((t) => console.log(`  - ${t.title}`));

  const completed = await taskRepo.markComplete(t1.id);
  console.log(`\nmarkComplete: "${completed?.title}" -> completed=${completed?.completed}`);

  const deleted = await taskRepo.deleteById(t3.id);
  console.log(`deleteById: removed "${deleted?.title}"`);
  console.log(`final task count: ${await taskRepo.count()}\n`);
}


async function withTransaction<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function drillTransactions(pool: Pool) {
  console.log("drill 4\n");

  console.log("test 1: successful transaction");
  const result = await withTransaction(pool, async (client) => {
    const userRes = await client.query<User>(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      ["Kiran", "kiran@example.com"],
    );
    const user = userRes.rows[0];

    const tasks = [];
    for (const title of ["Setup project", "Write docs", "Deploy"]) {
      const taskRes = await client.query<Task>(
        "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
        [title, user.id],
      );
      tasks.push(taskRes.rows[0]);
    }
    return { user, tasks };
  });
  console.log(`  created ${result.user.name} with ${result.tasks.length} tasks`);

  console.log("\ntest 2: failed transaction (rollback)");
  const usersBefore = (await pool.query("SELECT COUNT(*) FROM users")).rows[0].count;
  const tasksBefore = (await pool.query("SELECT COUNT(*) FROM tasks")).rows[0].count;

  try {
    await withTransaction(pool, async (client) => {
      await client.query("INSERT INTO users (name, email) VALUES ($1, $2)", ["Ghost", "ghost@example.com"]);
      await client.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", ["Ghost task", 1]);
      await client.query("INSERT INTO users (name, email) VALUES ($1, $2)", ["Dup", "girish@example.com"]);
    });
  } catch (err) {
    console.log(`  failed: ${(err as DatabaseError).message}`);
  }

  const usersAfter = (await pool.query("SELECT COUNT(*) FROM users")).rows[0].count;
  const tasksAfter = (await pool.query("SELECT COUNT(*) FROM tasks")).rows[0].count;
  console.log(`  users: ${usersBefore} -> ${usersAfter} (unchanged = rollback worked)`);
  console.log(`  tasks: ${tasksBefore} -> ${tasksAfter} (unchanged = rollback worked)`);

  console.log("\ntest 3: atomic transfer");
  const taskToTransfer = await pool.query("SELECT id FROM tasks WHERE user_id = $1 LIMIT 1", [result.user.id]);
  if (taskToTransfer.rows.length > 0) {
    const taskId = taskToTransfer.rows[0].id;
    const girish = await pool.query<User>("SELECT * FROM users WHERE email = $1", ["girish@example.com"]);
    await withTransaction(pool, async (client) => {
      await client.query("UPDATE tasks SET user_id = $1 WHERE id = $2", [girish.rows[0].id, taskId]);
    });
    const transferred = await pool.query("SELECT user_id FROM tasks WHERE id = $1", [taskId]);
    console.log(`  task ${taskId}: user ${result.user.id} -> user ${transferred.rows[0].user_id}`);
  }
  console.log();
}


const PG_ERROR_MAP: Record<string, { status: number; message: string }> = {
  "23505": { status: 409, message: "already exists" },
  "23503": { status: 400, message: "referenced record not found" },
  "23514": { status: 400, message: "validation failed" },
  "23502": { status: 400, message: "required field missing" },
  "42P01": { status: 500, message: "table not found" },
};

function mapPgError(err: DatabaseError): { status: number; message: string } {
  const mapped = PG_ERROR_MAP[err.code || ""];
  if (mapped) return { status: mapped.status, message: `${mapped.message}: ${err.detail || err.message}` };
  return { status: 500, message: err.message };
}

async function queryWithTiming(pool: Pool, sql: string, params: any[] = []) {
  const start = Date.now();
  const result = await pool.query(sql, params);
  const duration = Date.now() - start;
  if (duration > 100) {
    console.log(`  slow query (${duration}ms): ${sql.substring(0, 80)}`);
  }
  return { result, duration };
}

async function drillErrorHandling(pool: Pool) {
  console.log("drill 5\n");

  console.log("error mapping:");

  try {
    await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", ["Dup", "girish@example.com"]);
  } catch (err) {
    const mapped = mapPgError(err as DatabaseError);
    console.log(`  unique violation -> ${mapped.status}: ${mapped.message}`);
  }

  try {
    await pool.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", ["Test", 99999]);
  } catch (err) {
    const mapped = mapPgError(err as DatabaseError);
    console.log(`  fk violation -> ${mapped.status}: ${mapped.message}`);
  }

  try {
    await pool.query("INSERT INTO tasks (title) VALUES ($1)", [""]);
  } catch (err) {
    const mapped = mapPgError(err as DatabaseError);
    console.log(`  check violation -> ${mapped.status}: ${mapped.message}`);
  }

  console.log("\nslow query logging:");
  const { duration: d1 } = await queryWithTiming(pool, "SELECT * FROM users");
  console.log(`  simple select: ${d1}ms`);

  const { duration: d2 } = await queryWithTiming(
    pool,
    "SELECT u.*, COUNT(t.id) FROM users u LEFT JOIN tasks t ON t.user_id = u.id GROUP BY u.id",
  );
  console.log(`  join + group: ${d2}ms`);

  console.log("\ncircuit breaker:");
  let failures = 0;
  const maxFailures = 3;
  let circuitOpen = false;

  async function protectedQuery(sql: string, params: any[] = []) {
    if (circuitOpen) {
      console.log("  circuit open, skipping query");
      return null;
    }
    try {
      const result = await pool.query(sql, params);
      failures = 0;
      return result;
    } catch {
      failures++;
      if (failures >= maxFailures) {
        circuitOpen = true;
        console.log("  circuit opened after 3 failures");
      }
      return null;
    }
  }

  await protectedQuery("SELECT * FROM nonexistent1");
  await protectedQuery("SELECT * FROM nonexistent2");
  await protectedQuery("SELECT * FROM nonexistent3");
  const blocked = await protectedQuery("SELECT 1");
  console.log(`  query after circuit open: ${blocked === null ? "blocked" : "allowed"}\n`);
}


function getDbConfig(env: string): PoolConfig {
  const configs: Record<string, PoolConfig> = {
    development: {
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    },
    test: {
      connectionString: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 3000,
    },
    production: {
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: false },
    },
  };
  return configs[env] || configs.development;
}

async function drillEnvConfig(pool: Pool) {
  console.log("drill 6\n");

  const envs = ["development", "test", "production"];
  for (const env of envs) {
    const config = getDbConfig(env);
    console.log(`${env}:`);
    console.log(`  max: ${config.max}, idle: ${config.idleTimeoutMillis}ms, timeout: ${config.connectionTimeoutMillis}ms`);
    console.log(`  ssl: ${config.ssl ? "enabled" : "disabled"}`);
  }

  console.log("\ncurrent env:", process.env.NODE_ENV || "development");

  console.log("\nread replica simulation:");
  const primaryPool = pool;
  const replicaPool = pool;

  async function readFromReplica(sql: string, params: any[] = []) {
    return replicaPool.query(sql, params);
  }

  async function writeToPrimary(sql: string, params: any[] = []) {
    return primaryPool.query(sql, params);
  }

  await writeToPrimary("UPDATE users SET name = $1 WHERE email = $2", ["Girish S", "girish@example.com"]);
  const readResult = await readFromReplica("SELECT name, email FROM users WHERE email = $1", ["girish@example.com"]);
  console.log(`  write to primary, read from replica: ${readResult.rows[0]?.name}`);

  console.log("\nmetrics:");
  const metrics = {
    pool_total: pool.totalCount,
    pool_idle: pool.idleCount,
    pool_waiting: pool.waitingCount,
    uptime: process.uptime().toFixed(1) + "s",
  };
  console.log(metrics);
  console.log();
}


async function main() {
  const pool = createManagedPool();

  await drillMigrations(pool);
  await drillConnectionManagement(pool);
  await drillRepositoryPattern(pool);
  await drillTransactions(pool);
  await drillErrorHandling(pool);
  await drillEnvConfig(pool);

  await pool.end();
  console.log("done");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
