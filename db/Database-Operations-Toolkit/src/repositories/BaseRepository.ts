import { trackedQuery } from "../db/database.js";

export class BaseRepository<T extends Record<string, any>> {
  constructor(protected tableName: string) {}

  async findById(id: number): Promise<T | null> {
    const result = await trackedQuery(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
    return (result.rows[0] as T) || null;
  }

  async findAll(): Promise<T[]> {
    const result = await trackedQuery(`SELECT * FROM ${this.tableName} ORDER BY id`);
    return result.rows as T[];
  }

  async deleteById(id: number): Promise<T | null> {
    const result = await trackedQuery(
      `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`,
      [id]
    );
    return (result.rows[0] as T) || null;
  }

  async count(): Promise<number> {
    const result = await trackedQuery(`SELECT COUNT(*) FROM ${this.tableName}`);
    return parseInt(result.rows[0].count);
  }
}
