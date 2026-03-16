import { pool } from "../db/database";
import { User } from "../types/User";

export class UserRepository {
  static async createUser(email: string): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (email)
       VALUES ($1)
       RETURNING *`,
      [email],
    );

    return result.rows[0];
  }

  static async getUserById(id: number): Promise<User | null> {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

    return result.rows[0] || null;
  }

  static async getAllUsers(): Promise<User[]> {
    const result = await pool.query(`SELECT * FROM users`);

    return result.rows;
  }
}
