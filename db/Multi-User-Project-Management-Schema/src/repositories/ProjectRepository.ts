import { pool } from "../db/database.js";
import { Project } from "../types/index.js";

export class ProjectRepository {
  static async create(name: string, description: string | null, ownerId: number): Promise<Project> {
    const result = await pool.query<Project>(
      "INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *",
      [name, description, ownerId]
    );
    return result.rows[0];
  }

  static async getById(id: number): Promise<Project | null> {
    const result = await pool.query<Project>(
      "SELECT * FROM projects WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  static async getByOwner(ownerId: number): Promise<Project[]> {
    const result = await pool.query<Project>(
      "SELECT * FROM projects WHERE owner_id = $1 ORDER BY created_at DESC",
      [ownerId]
    );
    return result.rows;
  }

  static async getAll(): Promise<Project[]> {
    const result = await pool.query<Project>("SELECT * FROM projects ORDER BY id");
    return result.rows;
  }

  static async updateTaskCount(projectId: number): Promise<void> {
    await pool.query(
      "UPDATE projects SET task_count = (SELECT COUNT(*) FROM tasks WHERE project_id = $1) WHERE id = $1",
      [projectId]
    );
  }

  static async getWithDetails(id: number) {
    const result = await pool.query(
      `SELECT p.*, u.name AS owner_name, u.email AS owner_email
       FROM projects p
       JOIN users u ON p.owner_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }
}
