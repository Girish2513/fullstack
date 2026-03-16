import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      completed BOOLEAN DEFAULT false,
      priority TEXT DEFAULT 'medium',
      user_id INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  const result = await sql`SELECT COUNT(*) as c FROM tasks`;
  if (Number(result[0].c) === 0) {
    await sql`INSERT INTO tasks (title, description, completed, priority, created_at, updated_at) VALUES
      ('Setup database', 'Configure PostgreSQL and create initial schema', true, 'high', '2025-01-15', '2025-01-15'),
      ('Build API', 'Create REST endpoints with Express and repositories', true, 'high', '2025-01-20', '2025-01-20'),
      ('Create frontend', 'Build the Next.js frontend with routing and layouts', false, 'medium', '2025-02-01', '2025-02-01'),
      ('Write tests', 'Add integration and unit tests for all endpoints', false, 'low', '2025-02-10', '2025-02-10'),
      ('Deploy app', 'Deploy to production with proper environment config', false, 'medium', '2025-02-15', '2025-02-15')
    `;
  }
}

export default sql;
