import type { PoolConfig } from "pg";

export function getDbConfig(): PoolConfig {
  const env = process.env.NODE_ENV || "development";

  if (env === "test") {
    return {
      connectionString: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 3000,
    };
  }

  if (env === "production") {
    return {
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: false },
    };
  }

  return {
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
}
