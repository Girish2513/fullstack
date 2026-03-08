import { Pool } from "pg";

let _pool: Pool;

export function setPool(p: Pool) {
  _pool = p;
}

export const pool = new Proxy({} as Pool, {
  get(_target, prop) {
    if (!_pool) {
      _pool = new Pool({ connectionString: process.env.DATABASE_URL });
    }
    const value = (_pool as any)[prop];
    if (typeof value === "function") {
      return value.bind(_pool);
    }
    return value;
  },
});
