import {
  pool,
  setupTables,
  createUser,
  createTask,
  createTag,
  tagTask,
} from "./db.js";

async function main() {
  await setupTables();

  const girish = await createUser("girish@example.com");
  const revanth = await createUser("revanth@example.com");

  const t1 = await createTask("Finish API project", girish.id);
  const t2 = await createTask("Deploy to production", girish.id);
  const t3 = await createTask("Go to gym", girish.id);
  const t4 = await createTask("Buy groceries", revanth.id);

  const urgent = await createTag("urgent");
  const home = await createTag("home");
  const office = await createTag("office");

  await tagTask(t1.id, urgent.id);
  await tagTask(t1.id, office.id);
  await tagTask(t2.id, office.id);
  await tagTask(t4.id, urgent.id);
  await tagTask(t4.id, home.id);
  await tagTask(t3.id, home.id);

  const junction = await pool.query(
    "SELECT * FROM task_tags ORDER BY task_id, tag_id",
  );
  console.log("Junction table (task_tags):");
  console.table(junction.rows);

  const tasksWithTags = await pool.query(`
    SELECT t.id, t.title, ARRAY_AGG(tg.name order by tg.name) AS tags
    FROM tasks t
    JOIN task_tags tt ON t.id = tt.task_id
    JOIN tags tg ON tt.tag_id = tg.id
    GROUP BY t.id, t.title
    ORDER BY t.id
  `);
  console.log("Tasks with their tags:");
  console.table(tasksWithTags.rows);

  const urgentTasks = await pool.query(
    `
    SELECT t.title
    FROM tasks t
    JOIN task_tags tt ON t.id = tt.task_id
    JOIN tags tg ON tt.tag_id = tg.id
    WHERE tg.name = $1
  `,
    ["urgent"],
  );
  console.log("Tasks tagged 'urgent':");
  console.table(urgentTasks.rows);

  const tagCounts = await pool.query(`
    SELECT tg.name AS tag, COUNT(tt.task_id) AS usage_count
    FROM tags tg
    LEFT JOIN task_tags tt ON tg.id = tt.tag_id
    GROUP BY tg.id, tg.name
    ORDER BY usage_count DESC
  `);
  console.log("Tag usage counts:");
  console.table(tagCounts.rows);

  await pool.end();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
