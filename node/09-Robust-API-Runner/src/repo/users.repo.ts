import { pool } from "../db/pool";

export async function createUser(email: string, name: string) {
  const result = await pool.query(
    `INSERT INTO users(email,name)
    VALUES($1,$2)
    RETURNING *`,
    [email, name],
  );

  return result.rows[0];
}

export async function getUser(id: number) {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);

  return result.rows[0];
}
