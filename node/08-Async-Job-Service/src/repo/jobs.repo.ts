import { pool } from "../db/pool";

export interface Job {
  id: number;
  idempotency_key: string | null;
  type: string;
  status: string;
  payload: any;
  result: any;
  attempts: number;
  max_attempts: number;
  created_at: Date;
  updated_at: Date;
}

export async function createJob(
  type: string,
  payload: any,
  idempotencyKey?: string,
): Promise<Job> {
  const { rows } = await pool.query(
    `INSERT INTO jobs (type, payload, idempotency_key)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [type, JSON.stringify(payload), idempotencyKey || null],
  );
  return rows[0];
}

export async function findJobByIdempotencyKey(
  key: string,
): Promise<Job | null> {
  const { rows } = await pool.query(
    `SELECT * FROM jobs WHERE idempotency_key = $1`,
    [key],
  );
  return rows[0] || null;
}

export async function getJobById(id: number): Promise<Job | null> {
  const { rows } = await pool.query(`SELECT * FROM jobs WHERE id = $1`, [id]);
  return rows[0] || null;
}

export async function claimNextPendingJob(): Promise<Job | null> {
  const { rows } = await pool.query(
    `UPDATE jobs
     SET status = 'running', attempts = attempts + 1, updated_at = NOW()
     WHERE id = (
       SELECT id FROM jobs
       WHERE status = 'pending' AND attempts < max_attempts
       ORDER BY created_at ASC
       LIMIT 1
     )
     RETURNING *`,
  );
  return rows[0] || null;
}

export async function markJobComplete(
  id: number,
  result: any,
): Promise<Job | null> {
  const { rows } = await pool.query(
    `UPDATE jobs SET status = 'complete', result = $2, updated_at = NOW()
     WHERE id = $1 RETURNING *`,
    [id, JSON.stringify(result)],
  );
  return rows[0] || null;
}

export async function markJobFailed(
  id: number,
  error: string,
): Promise<Job | null> {
  const { rows } = await pool.query(
    `UPDATE jobs
     SET status = CASE WHEN attempts >= max_attempts THEN 'failed' ELSE 'pending' END,
         result = $2,
         updated_at = NOW()
     WHERE id = $1 RETURNING *`,
    [id, JSON.stringify({ error })],
  );
  return rows[0] || null;
}
