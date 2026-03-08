import { pool } from "../db/pool";

export async function createNote(userId: number, content: string) {
  const result = await pool.query(
    `INSERT INTO notes(user_id, content) VALUES($1, $2) RETURNING *`,
    [userId, content],
  );
  return result.rows[0];
}

export async function getNotesByUser(userId: number) {
  const result = await pool.query(
    `SELECT * FROM notes WHERE user_id = $1 ORDER BY id`,
    [userId],
  );
  return result.rows;
}

export async function getNote(id: number) {
  const result = await pool.query(`SELECT * FROM notes WHERE id = $1`, [id]);
  return result.rows[0];
}
