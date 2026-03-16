import { pool } from "../db/database.js";

export class BaseRepository<T extends Record<string, any>> {
  constructor(protected tableName: string) {}

  async findById(id: number): Promise<T | null> {
    const result = await pool().query<T>(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findAll(): Promise<T[]> {
    const result = await pool().query<T>(`SELECT * FROM ${this.tableName} ORDER BY id`);
    return result.rows;
  }

  async deleteById(id: number): Promise<T | null> {
    const result = await pool().query<T>(
      `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  async count(): Promise<number> {
    const result = await pool().query(`SELECT COUNT(*) FROM ${this.tableName}`);
    return parseInt(result.rows[0].count);
  }
}
