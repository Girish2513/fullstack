import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log("=== Performance: Normalized vs Denormalized ===\n");

  const user = await pool.query("SELECT id FROM users LIMIT 1");
  if (user.rows.length === 0) {
    console.log("No users found. Run the API and create some data first.");
    await pool.end();
    return;
  }

  const userId = user.rows[0].id;
  const project = await pool.query(
    "INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id",
    ["Perf Test Project", "For benchmarking", userId]
  );
  const projectId = project.rows[0].id;

  console.log("Inserting 1000 tasks...");
  for (let i = 0; i < 1000; i++) {
    await pool.query(
      "INSERT INTO tasks (title, user_id, project_id) VALUES ($1, $2, $3)",
      [`Perf task ${i + 1}`, userId, projectId]
    );
  }

  await pool.query(
    "UPDATE projects SET task_count = (SELECT COUNT(*) FROM tasks WHERE project_id = $1) WHERE id = $1",
    [projectId]
  );

  console.log("Running 100 iterations of each query...\n");

  const iterations = 100;

  const startNormalized = Date.now();
  for (let i = 0; i < iterations; i++) {
    await pool.query("SELECT COUNT(*) FROM tasks WHERE project_id = $1", [projectId]);
  }
  const normalizedTime = Date.now() - startNormalized;

  const startDenormalized = Date.now();
  for (let i = 0; i < iterations; i++) {
    await pool.query("SELECT task_count FROM projects WHERE id = $1", [projectId]);
  }
  const denormalizedTime = Date.now() - startDenormalized;

  console.log(`Normalized (COUNT every time): ${normalizedTime}ms for ${iterations} queries`);
  console.log(`Denormalized (stored count):   ${denormalizedTime}ms for ${iterations} queries`);
  console.log(`\nDenormalized is ${(normalizedTime / denormalizedTime).toFixed(1)}x faster`);

  console.log("\nTrade-offs:");
  console.log("  Normalized:   always accurate, slower on large datasets");
  console.log("  Denormalized: fast reads, must manually update on insert/delete");

  await pool.query("DELETE FROM tasks WHERE project_id = $1", [projectId]);
  await pool.query("DELETE FROM projects WHERE id = $1", [projectId]);
  console.log("\nCleaned up test data.");

  await pool.end();
}

main().catch((err) => {
  console.error("Error:", err.message);
  pool.end();
  process.exit(1);
});
