import { nanoid } from "nanoid";
import { getDB } from "../db/database.js";
import { users } from "../db/schema.js";
import { getLogger } from "../utils/logger.js";

export async function addUser(opts: { name: string }) {
  const db = await getDB();
  const log = await getLogger();

  await db.insert(users).values({
    id: nanoid(),
    name: opts.name,
    createdAt: Date.now(),
  });

  log.info({ name: opts.name }, "User added");
  console.log("User added");
}
