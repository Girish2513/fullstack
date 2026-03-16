-- Drop tables if they exist (for clean reset)
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL CHECK (LENGTH(title) > 0),
    completed BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);