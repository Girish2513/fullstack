import { Pool } from "pg";

let _pool: Pool;

export function setPool(p: Pool) {
  _pool = p;
}

export function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return _pool;
}

export const pool = new Proxy({} as Pool, {
  get(_target, prop) {
    const p = getPool();
    const value = (p as any)[prop];
    if (typeof value === "function") {
      return value.bind(p);
    }
    return value;
  },
});
