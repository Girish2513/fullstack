import { pool, setupTables, createUser, createTask } from "./db.js";

async function main() {
  await setupTables();

  const girish = await createUser("girish@example.com");

  const t1 = await createTask("Finish API project", girish.id);
  const t2 = await createTask("Deploy to production", girish.id);
  const t3 = await createTask("Go to gym", girish.id);

  await pool.query("ALTER TABLE tasks ADD COLUMN metadata JSONB DEFAULT '{}'");

  await pool.query("UPDATE tasks SET metadata = $1 WHERE id = $2", [
    JSON.stringify({
      priority: "high",
      tags: ["important"],
      due_date: "2024-01-15",
    }),
    t1.id,
  ]);
  await pool.query("UPDATE tasks SET metadata = $1 WHERE id = $2", [
    JSON.stringify({
      priority: "low",
      tags: ["optional"],
      due_date: "2024-02-01",
    }),
    t2.id,
  ]);
  await pool.query("UPDATE tasks SET metadata = $1 WHERE id = $2", [
    JSON.stringify({ priority: "high", tags: ["fitness", "health"] }),
    t3.id,
  ]);

  const allMeta = await pool.query(
    "SELECT id, title, metadata FROM tasks ORDER BY id",
  );
  console.log("Tasks with JSONB metadata:");
  console.log(allMeta.rows);
  console.table(allMeta.rows);

  const highPriority = await pool.query(
    `
    SELECT id, title, metadata->>'priority' AS priority
    FROM tasks
    WHERE metadata->>'priority' = $1
  `,
    ["high"],
  );
  console.log("Query by JSON field (priority = 'high'):");
  console.table(highPriority.rows);

  await pool.query(
    `
    UPDATE tasks SET metadata = metadata || $1 WHERE id = $2
  `,
    [
      JSON.stringify({
        completed_at: new Date().toISOString(),
        notes: "Done!",
      }),
      t1.id,
    ],
  );

  const updated = await pool.query(
    "SELECT id, title, metadata FROM tasks WHERE id = $1",
    [t1.id],
  );
  console.log("After merging new fields into existing JSON:");
  console.table(updated.rows);

  await pool.query(
    "CREATE INDEX idx_tasks_metadata ON tasks USING gin(metadata)",
  );
  console.log("Created GIN index on metadata column.");
  const withTag = await pool.query(`
    SELECT id, title, metadata->'tags' AS tags
    FROM tasks
    WHERE metadata->'tags' @> '"important"'
  `);
  console.log("\nTasks where tags contain 'important' (uses GIN index):");
  console.table(withTag.rows);

  await pool.end();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
