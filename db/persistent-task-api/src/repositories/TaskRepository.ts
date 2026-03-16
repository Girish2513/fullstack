import { pool } from "../db/database";
import { Task } from "../types/Task";

export class TaskRepository {
  static async createTask(userId: number, title: string): Promise<Task> {
    const result = await pool.query(
      `INSERT INTO tasks (title, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [title, userId],
    );

    return result.rows[0];
  }

  static async getTasksByUser(userId: number): Promise<Task[]> {
    const result = await pool.query(
      `SELECT * FROM tasks
       WHERE user_id = $1`,
      [userId],
    );

    return result.rows;
  }

  static async completeTask(taskId: number): Promise<Task> {
    const result = await pool.query(
      `UPDATE tasks
       SET completed = true
       WHERE id = $1
       RETURNING *`,
      [taskId],
    );

    return result.rows[0];
  }

  static async deleteTask(taskId: number): Promise<void> {
    await pool.query(
      `DELETE FROM tasks
       WHERE id = $1`,
      [taskId],
    );
  }
}
