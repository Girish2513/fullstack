import { pool, setupTables, createUser, createCategory, createTask } from "./db.js";

async function main() {
  await setupTables();

  const girish = await createUser("girish@example.com");
  const revanth = await createUser("revanth@example.com");

  const work = await createCategory("Work", "blue");
  const personal = await createCategory("Personal", "green");
  const shopping = await createCategory("Shopping", "orange");

  await createTask("Finish API project", girish.id, work.id);
  await createTask("Deploy to production", girish.id, work.id);
  await createTask("Go to gym", girish.id, personal.id);
  await createTask("Buy groceries", revanth.id, shopping.id);
  await createTask("Read a book", revanth.id, personal.id);

  const allTasks = await pool.query(`
    SELECT t.id, t.title, u.email, c.name AS category, c.color
    FROM tasks t
    JOIN users u ON t.user_id = u.id
    JOIN categories c ON t.category_id = c.id
    ORDER BY t.id
  `);
  console.log("All tasks with user and category:");
  console.table(allTasks.rows);

  const grouped = await pool.query(`
    SELECT c.name AS category, c.color, COUNT(t.id) AS task_count
    FROM categories c
    LEFT JOIN tasks t ON t.category_id = c.id
    GROUP BY c.id, c.name, c.color
    ORDER BY task_count DESC
  `);
  console.log("Tasks grouped by category:");
  console.table(grouped.rows);

  await pool.end();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
