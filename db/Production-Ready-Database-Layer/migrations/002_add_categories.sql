CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT
);

ALTER TABLE tasks ADD COLUMN category_id INTEGER REFERENCES categories(id);
