import { NextResponse } from "next/server";
import sql, { initDb } from "@/lib/db";

interface TaskRow {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  created_at: string;
  updated_at: string;
}

function formatTask(row: TaskRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: row.completed,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET() {
  await initDb();
  const rows = await sql`SELECT * FROM tasks ORDER BY created_at DESC` as TaskRow[];
  return NextResponse.json(rows.map(formatTask));
}

export async function POST(request: Request) {
  await initDb();
  const body = await request.json();
  const { title, description = "", priority = "medium", completed = false } = body;

  if (!title || title.trim().length < 3) {
    return NextResponse.json({ error: "Title must be at least 3 characters" }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO tasks (title, description, completed, priority)
    VALUES (${title.trim()}, ${description.trim()}, ${completed}, ${priority})
    RETURNING *
  ` as TaskRow[];

  return NextResponse.json(formatTask(rows[0]), { status: 201 });
}
