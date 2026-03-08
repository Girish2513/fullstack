import { parse } from "csv-parse/sync";
import fs from "fs-extra";
import { z } from "zod";
import { nanoid } from "nanoid";
import { getDB } from "../db/database.js";
import { users } from "../db/schema.js";

const RowSchema = z.object({
  name: z.string().min(1),
});

export async function importCSV(file: string) {
  const text = await fs.readFile(file, "utf8");

  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
  });

  const db = await getDB();

  let count = 0;

  for (const row of records) {
    const parsed = RowSchema.parse(row);

    await db.insert(users).values({
      id: nanoid(),
      name: parsed.name,
      createdAt: Date.now(),
    });

    count++;
  }

  return count;
}
