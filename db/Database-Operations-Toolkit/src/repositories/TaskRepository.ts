import { trackedQuery, withTransaction } from "../db/database.js";
import { BaseRepository } from "./BaseRepository.js";
import type { Task, Project } from "../types/index.js";

export class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super("tasks");
  }

  async create(title: string, userId: number, projectId?: number): Promise<Task> {
    const result = await trackedQuery(
      "INSERT INTO tasks (title, user_id, project_id) VALUES ($1, $2, $3) RETURNING *",
      [title, userId, projectId || null]
    );
    return result.rows[0] as Task;
  }

  async findByUser(userId: number): Promise<Task[]> {
    const result = await trackedQuery(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return result.rows as Task[];
  }

  async findByProject(projectId: number): Promise<Task[]> {
    const result = await trackedQuery(
      "SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC",
      [projectId]
    );
    return result.rows as Task[];
  }

  async markComplete(id: number): Promise<Task | null> {
    const result = await trackedQuery(
      "UPDATE tasks SET completed = true WHERE id = $1 RETURNING *",
      [id]
    );
    return (result.rows[0] as Task) || null;
  }

  async createProjectWithTasks(name: string, ownerId: number, titles: string[]) {
    return withTransaction(async (client) => {
      const projRes = await client.query<Project>(
        "INSERT INTO projects (name, owner_id) VALUES ($1, $2) RETURNING *",
        [name, ownerId]
      );
      const project = projRes.rows[0]!;

      const tasks: Task[] = [];
      for (const title of titles) {
        const taskRes = await client.query<Task>(
          "INSERT INTO tasks (title, user_id, project_id) VALUES ($1, $2, $3) RETURNING *",
          [title, ownerId, project.id]
        );
        tasks.push(taskRes.rows[0]!);
      }
      return { project, tasks };
    });
  }
}
