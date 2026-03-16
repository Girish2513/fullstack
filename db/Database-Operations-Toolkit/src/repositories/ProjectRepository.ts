import { trackedQuery } from "../db/database.js";
import { BaseRepository } from "./BaseRepository.js";
import type { Project } from "../types/index.js";

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super("projects");
  }

  async create(name: string, ownerId: number, description?: string): Promise<Project> {
    const result = await trackedQuery(
      "INSERT INTO projects (name, owner_id, description) VALUES ($1, $2, $3) RETURNING *",
      [name, ownerId, description || null]
    );
    return result.rows[0] as Project;
  }

  async findByOwner(ownerId: number): Promise<Project[]> {
    const result = await trackedQuery(
      "SELECT * FROM projects WHERE owner_id = $1 ORDER BY created_at DESC",
      [ownerId]
    );
    return result.rows as Project[];
  }
}
