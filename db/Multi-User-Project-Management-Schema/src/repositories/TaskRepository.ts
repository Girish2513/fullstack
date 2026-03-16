import { pool } from "../db/database.js";
import { Task } from "../types/index.js";

export class TaskRepository {
  static async create(
    title: string,
    userId: number,
    projectId?: number,
    metadata?: Record<string, unknown>
  ): Promise<Task> {
    const result = await pool.query<Task>(
      `INSERT INTO tasks (title, user_id, project_id, metadata)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, userId, projectId || null, JSON.stringify(metadata || {})]
    );
    return result.rows[0];
  }

  static async getById(id: number): Promise<Task | null> {
    const result = await pool.query<Task>(
      "SELECT * FROM tasks WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  static async getByUser(userId: number): Promise<Task[]> {
    const result = await pool.query<Task>(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return result.rows;
  }

  static async getByProject(projectId: number): Promise<Task[]> {
    const result = await pool.query<Task>(
      "SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC",
      [projectId]
    );
    return result.rows;
  }

  static async complete(id: number): Promise<Task | null> {
    const result = await pool.query<Task>(
      "UPDATE tasks SET completed = true WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<Task | null> {
    const result = await pool.query<Task>(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  }

  static async addTag(taskId: number, tagName: string): Promise<void> {
    await pool.query(
      `INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
      [tagName]
    );
    await pool.query(
      `INSERT INTO task_tags (task_id, tag_id)
       VALUES ($1, (SELECT id FROM tags WHERE name = $2))
       ON CONFLICT DO NOTHING`,
      [taskId, tagName]
    );
  }

  static async getWithDetails(id: number) {
    const result = await pool.query(
      `SELECT t.*,
              u.name AS user_name,
              p.name AS project_name,
              ARRAY_AGG(DISTINCT tg.name) FILTER (WHERE tg.name IS NOT NULL) AS tags
       FROM tasks t
       LEFT JOIN users u ON t.user_id = u.id
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN task_tags tt ON tt.task_id = t.id
       LEFT JOIN tags tg ON tg.id = tt.tag_id
       WHERE t.id = $1
       GROUP BY t.id, u.name, p.name`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async getByMetadata(key: string, value: string): Promise<Task[]> {
    const result = await pool.query<Task>(
      `SELECT * FROM tasks WHERE metadata->>$1 = $2`,
      [key, value]
    );
    return result.rows;
  }
}
