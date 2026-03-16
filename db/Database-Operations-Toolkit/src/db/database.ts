import { Pool, type PoolClient, type DatabaseError } from "pg";
import { getDbConfig } from "./config.js";
import type { DbMetrics } from "../types/index.js";

let _pool: Pool | null = null;

export function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool(getDbConfig());
    _pool.on("error", (err) => {
      console.error("pool error:", err.message);
    });
  }
  return _pool;
}

const metrics: DbMetrics = {
  queryCount: 0,
  totalTime: 0,
  avgTime: 0,
  slowQueries: 0,
  errors: 0,
};

export async function trackedQuery(sql: string, params: any[] = []) {
  const start = Date.now();
  try {
    const result = await getPool().query(sql, params);
    const ms = Date.now() - start;
    metrics.queryCount++;
    metrics.totalTime += ms;
    metrics.avgTime = metrics.totalTime / metrics.queryCount;
    if (ms > 100) {
      metrics.slowQueries++;
      console.log(`[slow query ${ms}ms] ${sql.substring(0, 80)}`);
    }
    return result;
  } catch (err) {
    metrics.errors++;
    throw err;
  }
}

export function getMetrics(): DbMetrics {
  return { ...metrics };
}

export function resetMetrics() {
  metrics.queryCount = 0;
  metrics.totalTime = 0;
  metrics.avgTime = 0;
  metrics.slowQueries = 0;
  metrics.errors = 0;
}

export async function testConnection(): Promise<boolean> {
  try {
    await getPool().query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export async function healthCheck() {
  const start = Date.now();
  const pool = getPool();
  try {
    await pool.query("SELECT 1");
    const dbSize = await pool.query(
      "SELECT pg_size_pretty(pg_database_size(current_database())) as size"
    );
    return {
      status: "healthy",
      latency: Date.now() - start,
      pool: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount,
        max: (pool as any).options.max || 10,
      },
      database: {
        size: dbSize.rows[0]?.size,
      },
      metrics: getMetrics(),
    };
  } catch {
    return {
      status: "unhealthy",
      latency: Date.now() - start,
      pool: { total: 0, idle: 0, waiting: 0, max: 0 },
      database: { size: "unknown" },
      metrics: getMetrics(),
    };
  }
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
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

const PG_ERROR_MAP: Record<string, { status: number; message: string }> = {
  "23505": { status: 409, message: "already exists" },
  "23503": { status: 400, message: "referenced record not found" },
  "23514": { status: 400, message: "validation failed" },
  "23502": { status: 400, message: "required field missing" },
  "42P01": { status: 500, message: "table not found" },
};

export function mapPgError(err: DatabaseError): { status: number; message: string } {
  const mapped = PG_ERROR_MAP[err.code || ""];
  if (mapped) return { status: mapped.status, message: `${mapped.message}: ${err.detail || err.message}` };
  return { status: 500, message: err.message };
}

export async function closePool() {
  if (_pool) {
    await _pool.end();
    _pool = null;
  }
}
