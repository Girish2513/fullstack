DROP TABLE IF EXISTS task_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}'
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL CHECK (LENGTH(name) > 0),
  description TEXT,
  owner_id INTEGER REFERENCES users(id),
  task_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL CHECK (LENGTH(title) > 0),
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  user_id INTEGER REFERENCES users(id),
  project_id INTEGER REFERENCES projects(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  body TEXT NOT NULL CHECK (LENGTH(body) > 0),
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES users(id),
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE task_tags (
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_comments_task ON comments(task_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_tasks_metadata ON tasks USING gin(metadata);
