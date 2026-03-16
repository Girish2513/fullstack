import { trackedQuery } from "../db/database.js";
import { BaseRepository } from "./BaseRepository.js";
import type { User } from "../types/index.js";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super("users");
  }

  async create(name: string, email: string): Promise<User> {
    const result = await trackedQuery(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    return result.rows[0] as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await trackedQuery("SELECT * FROM users WHERE email = $1", [email]);
    return (result.rows[0] as User) || null;
  }

  async update(id: number, name: string, email: string): Promise<User | null> {
    const result = await trackedQuery(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    return (result.rows[0] as User) || null;
  }
}
