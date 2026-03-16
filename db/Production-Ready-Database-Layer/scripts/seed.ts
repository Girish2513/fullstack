import dotenv from "dotenv";
dotenv.config();

import { withTransaction, closePool } from "../src/db/database.js";
import type { User, Project } from "../src/types/index.js";

async function main() {
  console.log("seeding database...");

  await withTransaction(async (client) => {
    const u1 = (await client.query<User>(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      ["Girish", "girish@example.com"]
    )).rows[0]!;

    const u2 = (await client.query<User>(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      ["Revanth", "revanth@example.com"]
    )).rows[0]!;

    const p1 = (await client.query<Project>(
      "INSERT INTO projects (name, owner_id, description) VALUES ($1, $2, $3) RETURNING *",
      ["Task App", u1.id, "main project"]
    )).rows[0]!;

    const p2 = (await client.query<Project>(
      "INSERT INTO projects (name, owner_id, description) VALUES ($1, $2, $3) RETURNING *",
      ["Blog API", u2.id, "blog backend"]
    )).rows[0]!;

    const taskData = [
      ["Setup database", u1.id, p1.id],
      ["Build API routes", u1.id, p1.id],
      ["Write tests", u1.id, p1.id],
      ["Design schema", u2.id, p2.id],
      ["Add auth", u2.id, p2.id],
    ];

    for (const [title, userId, projectId] of taskData) {
      await client.query(
        "INSERT INTO tasks (title, user_id, project_id) VALUES ($1, $2, $3)",
        [title, userId, projectId]
      );
    }

    await client.query(
      "INSERT INTO categories (name, color) VALUES ($1, $2), ($3, $4)",
      ["Backend", "blue", "Frontend", "green"]
    );

    console.log(`  created ${2} users, ${2} projects, ${taskData.length} tasks, 2 categories`);
  });

  console.log("seed complete");
  await closePool();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
