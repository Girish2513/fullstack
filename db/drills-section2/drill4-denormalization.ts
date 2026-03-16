import { pool, setupTables, createUser, createTask } from "./db.js";

async function main() {
  await setupTables();

  const girish = await createUser("girish@example.com");

  await createTask("Build API", girish.id);
  await createTask("Write tests", girish.id);
  await createTask("Deploy app", girish.id);

  await pool.query("ALTER TABLE users ADD COLUMN task_count INTEGER DEFAULT 0");

  async function updateTaskCount(userId: number) {
    await pool.query(
      "UPDATE users SET task_count = (SELECT COUNT(*) FROM tasks WHERE user_id = $1) WHERE id = $1",
      [userId]
    );
  }

  await updateTaskCount(girish.id);

  const userWithCount = await pool.query("SELECT id, email, task_count FROM users WHERE id = $1", [girish.id]);
  console.log("User with stored task_count:");
  console.table(userWithCount.rows);

  console.log("\nInserting 1000 tasks for performance comparison...");
  for (let i = 0; i < 1000; i++) {
    await pool.query(
      "INSERT INTO tasks (title, user_id) VALUES ($1, $2)",
      [`Bulk task ${i + 1}`, girish.id]
    );
  }
  await updateTaskCount(girish.id);

  const startLive = Date.now();
  await pool.query("SELECT COUNT(*) FROM tasks WHERE user_id = $1", [girish.id]);
  const liveDuration = Date.now() - startLive;

  const startStored = Date.now();
  await pool.query("SELECT task_count FROM users WHERE id = $1", [girish.id]);
  const storedDuration = Date.now() - startStored;

  console.log(`\nLive COUNT(*) query: ${liveDuration}ms`);
  console.log(`Stored task_count read: ${storedDuration}ms`);

  const finalUser = await pool.query("SELECT id, email, task_count FROM users WHERE id = $1", [girish.id]);
  console.log(`Stored task_count: ${finalUser.rows[0].task_count}`);

  console.log("\nTrade-offs:");
  console.log("  Live count  → always accurate, slower on large tables");
  console.log("  Stored count → fast read, but can go stale if you forget to update it");

  await pool.end();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
