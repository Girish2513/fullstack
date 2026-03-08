import Database from "better-sqlite3";

const db = new Database("database.db");

db.prepare(
  `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL
)
`,
).run();

console.log("Users table created");

interface User {
  id: number;
  email: string;
  password_hash: string;
  role: string;
}

function createUser(email: string, passwordHash: string, role: string): number {
  const stmt = db.prepare(`
    INSERT INTO users (email, password_hash, role)
    VALUES (?, ?, ?)
  `);

  const result = stmt.run(email, passwordHash, role);

  return result.lastInsertRowid as number;
}

function getUserByEmail(email: string): User | undefined {
  const stmt = db.prepare(`
    SELECT * FROM users WHERE email = ?
  `);

  return stmt.get(email) as User | undefined;
}

process.on("exit", () => {
  console.log("Graceful Exit");
  db.close();
});

// TEST CODE
// const userId = createUser("girish@test.com", "hashedpassword123", "user");

// console.log("Created user ID:", userId);

// const user = getUserByEmail("girish@test.com");

// console.log("Fetched user:", user);

// const missingUser = getUserByEmail("notfound@test.com");

// console.log("Missing user:", missingUser);
const users = db.prepare("SELECT * FROM users").all();
console.log(users);
export { createUser, getUserByEmail };
