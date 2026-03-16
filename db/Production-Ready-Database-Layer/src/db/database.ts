import { Pool, type PoolClient, type DatabaseError } from "pg";
import { getDbConfig } from "./config.js";

let _pool: Pool | null = null;

function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool(getDbConfig());
    _pool.on("error", (err) => {
      console.error("pool error:", err.message);
    });
  }
  return _pool;
}

export { getPool as pool };

export async function testConnection(): Promise<boolean> {
  try {
    await getPool().query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export async function healthCheck(): Promise<{ status: string; latency: number }> {
  const start = Date.now();
  try {
    await getPool().query("SELECT 1");
    return { status: "healthy", latency: Date.now() - start };
  } catch {
    return { status: "unhealthy", latency: Date.now() - start };
  }
}

export function getPoolStatus() {
  const p = getPool();
  return {
    total: p.totalCount,
    idle: p.idleCount,
    waiting: p.waitingCount,
  };
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
