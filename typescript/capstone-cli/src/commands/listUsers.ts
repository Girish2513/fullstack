import { getDB } from "../db/database.js";
import { users } from "../db/schema.js";

export async function listUsers() {
  const db = await getDB();
  const rows = await db.select().from(users);

  console.table(rows);
}
