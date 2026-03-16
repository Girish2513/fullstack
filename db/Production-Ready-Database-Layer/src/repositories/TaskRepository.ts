import { pool } from "../db/database.js";
import { withTransaction } from "../db/database.js";
import { BaseRepository } from "./BaseRepository.js";
import type { Task } from "../types/index.js";

export class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super("tasks");
  }

  async create(title: string, userId: number, projectId?: number): Promise<Task> {
    const result = await pool().query<Task>(
      "INSERT INTO tasks (title, user_id, project_id) VALUES ($1, $2, $3) RETURNING *",
      [title, userId, projectId || null]
    );
    return result.rows[0]!;
  }

  async findByUser(userId: number): Promise<Task[]> {
    const result = await pool().query<Task>(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return result.rows;
  }

  async findByProject(projectId: number): Promise<Task[]> {
    const result = await pool().query<Task>(
      "SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC",
      [projectId]
    );
    return result.rows;
  }

  async markComplete(id: number): Promise<Task | null> {
    const result = await pool().query<Task>(
      "UPDATE tasks SET completed = true WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  }

  async createProjectWithTasks(
    projectName: string,
    ownerId: number,
    taskTitles: string[]
  ) {
    return withTransaction(async (client) => {
      const projResult = await client.query<Task>(
        "INSERT INTO projects (name, owner_id) VALUES ($1, $2) RETURNING *",
        [projectName, ownerId]
      );
      const project = projResult.rows[0]!;

      const tasks = [];
      for (const title of taskTitles) {
        const taskResult = await client.query<Task>(
          "INSERT INTO tasks (title, user_id, project_id) VALUES ($1, $2, $3) RETURNING *",
          [title, ownerId, project.id]
        );
        tasks.push(taskResult.rows[0]!);
      }

      return { project, tasks };
    });
  }
}
