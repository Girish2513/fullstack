import { pool, setupTables, createUser, createCategory, createTask, createTag, tagTask } from "./db.js";

async function main() {
  await setupTables();

  const girish = await createUser("girish@example.com");
  const revanth = await createUser("revanth@example.com");

  const work = await createCategory("Work", "blue");
  const personal = await createCategory("Personal", "green");

  const t1 = await createTask("Finish API project", girish.id, work.id);
  const t2 = await createTask("Deploy to production", girish.id, work.id);
  const t3 = await createTask("Go to gym", girish.id, personal.id);
  const t4 = await createTask("Buy groceries", revanth.id);
  const t5 = await createTask("Read a book", revanth.id, personal.id);

  const urgent = await createTag("urgent");
  const office = await createTag("office");
  await tagTask(t1.id, urgent.id);
  await tagTask(t1.id, office.id);
  await tagTask(t2.id, office.id);

  await pool.query(`
    CREATE TABLE projects (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      owner_id INTEGER REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query("ALTER TABLE tasks ADD COLUMN project_id INTEGER REFERENCES projects(id)");

  await pool.query(`
    CREATE TABLE comments (
      id SERIAL PRIMARY KEY,
      task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
      author_id INTEGER REFERENCES users(id),
      body TEXT NOT NULL CHECK (LENGTH(body) > 0),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE user_preferences (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE REFERENCES users(id),
      settings JSONB DEFAULT '{}'
    )
  `);
  console.log("Created projects, comments, and user_preferences tables.\n");

  const proj = await pool.query(
    "INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *",
    ["Task App", "The main project", girish.id]
  );
  await pool.query("UPDATE tasks SET project_id = $1 WHERE id IN ($2, $3)", [proj.rows[0].id, t1.id, t2.id]);

  await pool.query("INSERT INTO comments (task_id, author_id, body) VALUES ($1, $2, $3)", [t1.id, revanth.id, "Looks good, almost done!"]);
  await pool.query("INSERT INTO comments (task_id, author_id, body) VALUES ($1, $2, $3)", [t1.id, girish.id, "Thanks, will finish today."]);
  await pool.query("INSERT INTO comments (task_id, author_id, body) VALUES ($1, $2, $3)", [t2.id, girish.id, "Need help with deployment."]);

  await pool.query("INSERT INTO user_preferences (user_id, settings) VALUES ($1, $2)",
    [girish.id, JSON.stringify({ theme: "dark", notifications: true, language: "en" })]);
  await pool.query("INSERT INTO user_preferences (user_id, settings) VALUES ($1, $2)",
    [revanth.id, JSON.stringify({ theme: "light", notifications: false, language: "te" })]);

  const taskWithProject = await pool.query(`
    SELECT t.id, t.title, p.name AS project, u.email AS owner
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u ON p.owner_id = u.id
    ORDER BY t.id
  `);
  console.log("Tasks with projects (NULL = standalone):");
  console.table(taskWithProject.rows);

  const taskComments = await pool.query(`
    SELECT c.body, u.email AS author, t.title AS task
    FROM comments c
    JOIN users u ON c.author_id = u.id
    JOIN tasks t ON c.task_id = t.id
    ORDER BY c.created_at
  `);
  console.log("Comments on tasks:");
  console.table(taskComments.rows);

  const prefs = await pool.query(`
    SELECT u.email, up.settings->>'theme' AS theme, up.settings->>'language' AS language
    FROM user_preferences up
    JOIN users u ON up.user_id = u.id
  `);
  console.log("User preferences (from JSONB):");
  console.table(prefs.rows);

  const fullQuery = await pool.query(`
    SELECT
      t.title,
      u.email AS assigned_to,
      c.name AS category,
      p.name AS project,
      COUNT(DISTINCT cm.id) AS comment_count,
      ARRAY_AGG(DISTINCT tg.name) FILTER (WHERE tg.name IS NOT NULL) AS tags
    FROM tasks t
    JOIN users u ON t.user_id = u.id
    LEFT JOIN categories c ON t.category_id = c.id
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN comments cm ON cm.task_id = t.id
    LEFT JOIN task_tags tt ON tt.task_id = t.id
    LEFT JOIN tags tg ON tg.id = tt.tag_id
    GROUP BY t.id, t.title, u.email, c.name, p.name
    ORDER BY t.id
  `);
  console.log("Full query spanning all relationships:");
  console.table(fullQuery.rows);

  await pool.end();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
