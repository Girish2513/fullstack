import { pool } from "../db/database.js";
import { User, UserPreferences } from "../types/index.js";

export class UserRepository {
  static async create(name: string, email: string): Promise<User> {
    const result = await pool.query<User>(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    return result.rows[0];
  }

  static async getById(id: number): Promise<User | null> {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  static async getAll(): Promise<User[]> {
    const result = await pool.query<User>("SELECT * FROM users ORDER BY id");
    return result.rows;
  }

  static async setPreferences(userId: number, settings: Record<string, unknown>): Promise<UserPreferences> {
    const result = await pool.query<UserPreferences>(
      `INSERT INTO user_preferences (user_id, settings)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET settings = $2
       RETURNING *`,
      [userId, JSON.stringify(settings)]
    );
    return result.rows[0];
  }

  static async getPreferences(userId: number): Promise<UserPreferences | null> {
    const result = await pool.query<UserPreferences>(
      "SELECT * FROM user_preferences WHERE user_id = $1",
      [userId]
    );
    return result.rows[0] || null;
  }
}
