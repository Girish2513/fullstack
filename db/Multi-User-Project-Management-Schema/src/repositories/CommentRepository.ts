import { pool } from "../db/database.js";
import { Comment } from "../types/index.js";

export class CommentRepository {
  static async create(
    body: string,
    taskId: number,
    authorId: number,
    parentId?: number
  ): Promise<Comment> {
    const result = await pool.query<Comment>(
      `INSERT INTO comments (body, task_id, author_id, parent_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [body, taskId, authorId, parentId || null]
    );
    return result.rows[0];
  }

  static async getByTask(taskId: number) {
    const result = await pool.query(
      `SELECT c.*, u.name AS author_name, u.email AS author_email
       FROM comments c
       JOIN users u ON c.author_id = u.id
       WHERE c.task_id = $1
       ORDER BY c.created_at`,
      [taskId]
    );
    return result.rows;
  }

  static async getReplies(commentId: number) {
    const result = await pool.query(
      `SELECT c.*, u.name AS author_name
       FROM comments c
       JOIN users u ON c.author_id = u.id
       WHERE c.parent_id = $1
       ORDER BY c.created_at`,
      [commentId]
    );
    return result.rows;
  }

  static async getThreaded(taskId: number) {
    const result = await pool.query(
      `SELECT c.id, c.body, c.parent_id, c.created_at, u.name AS author_name
       FROM comments c
       JOIN users u ON c.author_id = u.id
       WHERE c.task_id = $1
       ORDER BY COALESCE(c.parent_id, c.id), c.created_at`,
      [taskId]
    );
    return result.rows;
  }

  static async delete(id: number): Promise<void> {
    await pool.query("DELETE FROM comments WHERE id = $1", [id]);
  }
}
